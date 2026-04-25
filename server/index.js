require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// routes files that contain the actual api endpoint
const authRoutes = require('./routes/auth')
const runsRoutes = require('./routes/runs')

// make them available at /auth and /runs
app.use('/auth', authRoutes)
app.use('/runs', runsRoutes)
app.get('/health', async (req, res) => {
  const db = require('./db/knex')
  try {
    await db.raw('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
