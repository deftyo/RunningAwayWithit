import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// API endpoints
import authRoutes from './routes/auth'
import runsRoutes from './routes/runs'
import shoesRoutes from './routes/shoes'
import routesRoutes from './routes/routes' // maybe swap this?
import goalsRoutes from './routes/goals'

import db from './db/knex'

const app = express()
const PORT = process.env.PORT || 3085

app.use(cors())
app.use(express.json())
// use the API endpoints
app.use('/auth', authRoutes)
app.use('/runs', runsRoutes)
app.use('/shoes', shoesRoutes)
app.use('/routes', routesRoutes)
app.use('/goals', goalsRoutes)

app.get('/health', async (req, res) => {
    try {
        await db.raw('SELECT 1')
        res.json({ status: 'ok', database: 'connected' })
    } catch (err) {
        res.status(500).json({ status: 'error', database: 'disconnected' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
    console.error('Server error:', err)
})
