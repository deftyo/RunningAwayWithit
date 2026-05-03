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

router.get('/', authenticate, async (req, res) => {
    const userId = req.user.userId
    const { limit, month } = req.query

    try {
        let query = db('runs')
            .where({ user_id: userId })
            .orderBy('date', 'desc')

        if (month === 'current') {
            const start = new Date()
            start.setDate(1)
            start.setHours(0, 0, 0, 0)
            query = query.where('date', '>=', start)
        }

        if (limit) {
            query = query.limit(parseInt(limit))
        }

        const runs = await query
        res.json({ runs })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/:id', authenticate, async (req, res) => {
    const userId = req.user.userId
    const { id } = req.params
    const { date, distance, duration, notes } = req.body

    try {
        const run = await db('runs').where({ id, user_id: userId }).first()
        if (!run) {
            return res.status(404).json({ error: 'Run not found' })
        }

        const [updated] = await db('runs')
            .where({ id, user_id: userId })
            .update({ date, distance, duration, notes, updated_at: new Date() })
            .returning('*')

        res.json({ run: updated })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req, res) => {
    const userId = req.user.userId

    try {
        let query = db('runs')
            .where({ user_id: userId, id: req.params.id })
            .first()

        const run = await query
        res.json({ run })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', authenticate, async (req, res) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const run = await db('runs').where({ id, user_id: userId }).first()
        if (!run) {
            return res.status(404).json({ error: 'Run not found' })
        }

        await db('runs').where({ id, user_id: userId }).delete()
        res.status(204).send()

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/stats/summary', authenticate, async (req, res) => {
    const userId = req.user.userId

    try {
        const stats = await db('runs')
            .where({ user_id: userId })
            .select(
                db.raw('COUNT(*) as total_runs'),
                db.raw('SUM(distance) as total_distance'),
                db.raw('AVG(distance) as avg_distance'),
                db.raw('MAX(distance) as longest_run'),
                db.raw('SUM(duration) as total_duration'),
                db.raw('AVG(duration) as avg_duration')
            )
            .first()

        res.json({ stats })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
