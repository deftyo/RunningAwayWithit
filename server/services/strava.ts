import axios from 'axios'
import db from '../db/knex'

const CLIENT_ID = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET

// Ensures the stored token is fresh, refreshing if needed
// Returns a valid access token ready to use
export async function getValidStravaToken(userId: number): Promise<string> {
    const user = await db('users')
        .where({ id: userId })
        .select('strava_access_token', 'strava_refresh_token', 'strava_token_expires_at')
        .first()

    if (!user?.strava_refresh_token) {
        throw new Error('Strava not connected')
    }

    const now = new Date()
    const expiresAt = new Date(user.strava_token_expires_at)

    // If token is still valid (with 5 min buffer), use it as-is
    if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
        return user.strava_access_token
    }

    // Token expired — refresh it
    const res = await axios.post('https://www.strava.com/oauth/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: user.strava_refresh_token,
    })

    const { access_token, refresh_token, expires_at } = res.data

    await db('users').where({ id: userId }).update({
        strava_access_token: access_token,
        strava_refresh_token: refresh_token,
        strava_token_expires_at: new Date(expires_at * 1000),
    })

    return access_token
}
