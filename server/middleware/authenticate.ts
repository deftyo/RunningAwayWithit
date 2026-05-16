import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
    userId: string
}

// Extend Express's Request globally so all handlers see req.user
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}

export default authenticate
