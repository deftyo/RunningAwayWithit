import express, { Request, Response } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'

const router = express.Router()

const CLIENT_ID = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI
const JWT_SECRET = process.env.JWT_SECRET!

// Step 1 — redirect user to Strava, embedding their user ID in state
router.get('/connect', authenticate, (req: Request, res: Response) => {
    const userId = (req as any).user.userId

    // Sign a short-lived JWT as the state param
    const state = jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '10m' }  // Strava OAuth should never take longer than this
    )

    const params = new URLSearchParams({
        client_id: CLIENT_ID!,
        redirect_uri: REDIRECT_URI!,
        response_type: 'code',
        approval_prompt: 'auto',
        scope: 'activity:read_all',
        state,
    })

    res.redirect(`https://www.strava.com/oauth/authorize?${params}`)
})

// Step 2 — Strava redirects back here
router.get('/callback', async (req: Request, res: Response) => {
    const { code, state, error } = req.query

    if (error) {
        return res.redirect(`${process.env.CLIENT_URL}/dashboard?strava=denied`)
    }

    // Verify the state JWT and extract user ID
    let userId: number
    try {
        const payload = jwt.verify(state as string, JWT_SECRET) as { userId: number }
        userId = payload.userId
    } catch (err) {
        // State invalid or expired
        return res.redirect(`${process.env.CLIENT_URL}/dashboard?strava=error`)
    }

    try {
        // Exchange the code for tokens
        const tokenRes = await axios.post('https://www.strava.com/oauth/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        })

        const { access_token, refresh_token, expires_at, athlete } = tokenRes.data

        // Store tokens against the correct user
        await db('users').where({ id: userId }).update({
            strava_athlete_id: athlete.id,
            strava_access_token: access_token,
            strava_refresh_token: refresh_token,
            strava_token_expires_at: new Date(expires_at * 1000),
        })

        res.redirect(`${process.env.CLIENT_URL}/dashboard?strava=connected`)

    } catch (err) {
        console.error('Strava token exchange error:', err)
        res.redirect(`${process.env.CLIENT_URL}/dashboard?strava=error`)
    }
})

export default router
