require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

app.get('/health', async (req, res) => {
  const db = require('./db/knex')
  try {
    await db.raw('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
})

const authenticate = require('./middleware/authenticate')

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
