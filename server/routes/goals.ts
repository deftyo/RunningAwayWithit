import { Request, Response, Router } from 'express'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const goals = await db('goals')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc')

        res.json({ goals })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const goal = await db('goals')
            .where({ user_id: userId, id: req.params.id })
            .first()

        if (!goal) {
            res.status(404).json({ error: 'Goal not found' })
            return
        }

        res.json({ goal })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { type, target, period } = req.body

    // TODO: add validation

    try {
        const [goal] = await db('goals')
            .insert({ user_id: userId, type, target, period })
            .returning('*')

        res.status(201).json({ goal })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params
    const { type, target, period } = req.body

    // TODO: add validation

    try {
        const goal = await db('goals').where({ id, user_id: userId }).first()
        if (!goal) {
            res.status(404).json({ error: 'Goal not found' })
            return
        }

        const [updated] = await db('goals')
            .where({ id, user_id: userId })
            .update({ type, target, period, updated_at: new Date() })
            .returning('*')

        res.json({ goal: updated })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const goal = await db('goals').where({ id, user_id: userId }).first()
        if (!goal) {
            res.status(404).json({ error: 'Goal not found' })
            return
        }

        await db('goals').where({ id, user_id: userId }).delete()
        res.status(204).send()

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
