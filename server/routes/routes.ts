import { Request, Response, Router } from 'express'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const routes = await db('routes')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc')

        res.json({ routes })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId

    try {
        const route = await db('routes')
            .where({ user_id: userId, id: req.params.id })
            .first()

        if (!route) {
            res.status(404).json({ error: 'Route not found' })
            return
        }

        res.json({ route })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { name, notes } = req.body

    // TODO: add validation
    // TODO: GPS data ingestion to be added in Phase 2

    try {
        const [route] = await db('routes')
            .insert({ user_id: userId, name, notes })
            .returning('*')

        res.status(201).json({ route })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params
    const { name, notes } = req.body

    // TODO: add validation

    try {
        const route = await db('routes').where({ id, user_id: userId }).first()
        if (!route) {
            res.status(404).json({ error: 'Route not found' })
            return
        }

        const [updated] = await db('routes')
            .where({ id, user_id: userId })
            .update({ name, notes, updated_at: new Date() })
            .returning('*')

        res.json({ route: updated })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const route = await db('routes').where({ id, user_id: userId }).first()
        if (!route) {
            res.status(404).json({ error: 'Route not found' })
            return
        }

        await db('routes').where({ id, user_id: userId }).delete()
        res.status(204).send()

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
