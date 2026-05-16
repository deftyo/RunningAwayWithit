import { Request, Response, Router } from 'express'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'
import { validateRun, RunInput } from '../validation/runValidation'

const router = Router()

router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    const { date, distance, duration, notes } = req.body as RunInput
    const userId = req.user.userId
    const error = validateRun(req.body)
    if (error) {
        res.status(400).json({ error })
        return
    }

    try {
        const [run] = await db('runs')
            .insert({
                user_id: userId,
                date: date || new Date(),
                avg_pace: Number(duration) / Number(distance),
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

router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
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
            query = query.limit(parseInt(limit as string))
        }

        const runs = await query
        res.json({ runs })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params
    const { date, distance, duration, notes } = req.body as RunInput
    const error = validateRun(req.body)
    if (error) {
        res.status(400).json({ error })
        return
    }

    try {
        const run = await db('runs').where({ id, user_id: userId }).first()
        if (!run) {
            res.status(404).json({ error: 'Run not found' })
            return
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

router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const run = await db('runs')
            .where({ user_id: userId, id: req.params.id })
            .first()

        res.json({ run })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const run = await db('runs').where({ id, user_id: userId }).first()
        if (!run) {
            res.status(404).json({ error: 'Run not found' })
            return
        }

        await db('runs').where({ id, user_id: userId }).delete()
        res.status(204).send()

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/stats/summary', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const runs = await db('runs').where({ user_id: userId })
        res.json({ runs })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
