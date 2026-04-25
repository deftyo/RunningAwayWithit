const express = require('express')
const router = express.Router()
const db = require('../db/knex')
const authenticate = require('../middleware/authenticate')

router.post('/', authenticate, async (req, res) => {
    const { date, distance, duration, notes } = req.body
    const userId = req.user.userId

    try {
        const [run] = await db('runs')
            .insert({
                user_id: userId,
                date: date || new Date(),
                distance,
                duration,
                notes,
            })
            .returning('*')

        res.status(201).json({ run })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
