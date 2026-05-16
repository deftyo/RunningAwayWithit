import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/knex'

const router = Router()

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
        const existing = await db('users').where({ email }).first()
        if (existing) {
            res.status(409).json({ error: 'Email already registered' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [user] = await db('users')
            .insert({ email, password: hashedPassword })
            .returning(['id', 'email', 'created_at'])

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        )

        res.status(201).json({ user, token })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
        const user = await db('users').where({ email }).first()
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' })
            return
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' })
            return
        }

        await db('users').where({ id: user.id }).update({ last_login: new Date() })

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        )

        res.json({
            user: { id: user.id, email: user.email },
            token
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
