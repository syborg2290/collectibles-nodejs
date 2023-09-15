import jwt from 'jsonwebtoken';
import { jwtsecret } from '../config/jwt-secret';

export const authenticateToken = (req: any, res: any, next: any) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        jwt.verify(token, jwtsecret, (err: any, decoded: any) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            req.userId = decoded.userId; // Attach userId to the request
            next();
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }

};
