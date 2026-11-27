import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    usuarioId?: number;
}

export function autenticar(req: AuthRequest, res: Response,next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            mensagem: 'Usuário não autenticado'
        });
    }

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number
        };

        req.usuarioId = dados.id;

        next();

    } catch {
        return res.status(401).json({
            mensagem: 'Token inválido'
        });
    }
}