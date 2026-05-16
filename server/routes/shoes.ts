import { Request, Response, Router } from 'express'
import db from '../db/knex'
import authenticate from '../middleware/authenticate'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
    const userId = req.user.userId

    try {
        const shoes = await db('shoes')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc')

        res.json({ shoes })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', authenticate, async (req: Request, res: Response) => {
    const userId = req.user.userId

    try {
        const shoe = await db('shoes')
            .where({ user_id: userId, id: req.params.id })
            .first()

        if (!shoe) {
            res.status(404).json({ error: 'Shoe not found' })
        }

        res.json({ shoe })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: Request, res: Response) => {
    const userId = req.user.userId
    const { name, brand, notes } = req.body

    // TODO: add validation

    try {
        const [shoe] = await db('shoes')
            .insert({ user_id: userId, name, brand, notes })
            .returning('*')

        res.status(201).json({ shoe })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/:id', authenticate, async (req: Request, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params
    const { name, brand, notes, is_retired } = req.body

    // TODO: add validation

    try {
        const shoe = await db('shoes').where({ id, user_id: userId }).first()
        if (!shoe) {
            res.status(404).json({ error: 'Shoe not found' })
        }

        const [updated] = await db('shoes')
            .where({ id, user_id: userId })
            .update({ name, brand, notes, is_retired, updated_at: new Date() })
            .returning('*')

        res.json({ shoe: updated })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const shoe = await db('shoes').where({ id, user_id: userId }).first()
        if (!shoe) {
            res.status(404).json({ error: 'Shoe not found' })
        }

        await db('shoes').where({ id, user_id: userId }).delete()
        res.status(204).send()

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
