import express, { Request, Response } from 'express'
import axios from 'axios'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'
import { getValidStravaToken } from '../services/strava'

const router = express.Router()

router.get('/import-latest', authenticate, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId

    try {
        const accessToken = await getValidStravaToken(userId)

        // Fetch the single most recent activity from Strava
        const { data: activities } = await axios.get(
            'https://www.strava.com/api/v3/athlete/activities',
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { per_page: 1, page: 1 }
            }
        )

        if (!activities.length) {
            return res.status(404).json({ error: 'No activities found on Strava' })
        }

        const activity = activities[0]

        // Fetch the full activity stream (GPS points)
        const { data: streams } = await axios.get(
            `https://www.strava.com/api/v3/activities/${activity.id}/streams`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { keys: 'latlng,altitude,time', key_by_type: true }
            }
        )

        // Check if we've already imported this activity
        const existing = await db('runs')
            .where({ user_id: userId, strava_activity_id: activity.id })
            .first()

        if (existing) {
            return res.status(409).json({ error: 'Activity already imported', run: existing })
        }

        // Store the run with GPS data
        const [run] = await db('runs')
            .insert({
                user_id: userId,
                date: new Date(activity.start_date),
                distance: activity.distance / 1000,           // Strava gives metres
                duration: activity.moving_time,               // seconds
                avg_pace: activity.moving_time / (activity.distance / 1000),
                notes: activity.name,
                strava_activity_id: activity.id,
                gps_polyline: activity.map?.summary_polyline ?? null,
                gps_stream: streams.latlng
                    ? JSON.stringify(streams.latlng.data)
                    : null,
                elevation_stream: streams.altitude
                    ? JSON.stringify(streams.altitude.data)
                    : null,
            })
            .returning('*')

        res.status(201).json({ run })

    } catch (err: any) {
        if (err.message === 'Strava not connected') {
            return res.status(401).json({ error: 'Strava not connected' })
        }
        console.error('Strava import error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
