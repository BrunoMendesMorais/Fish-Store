import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../models/Usuario';
import { ErrorApp } from '../models/Error';

export interface AuthRequest extends Request {
    usuarioId?: number;
}

export async function autenticar(req: AuthRequest, res: Response,next: NextFunction) {
    const usuarioRepository: UsuarioRepository = UsuarioRepository.getInstance()

    const token = req.headers.authorization?.split(' ')[0];

    if (!token) {
        return res.status(401).json({
            mensagem: 'Usuário não autenticado'
        });
    }

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number,
            token: string
        };

        const usuarioToken = await(usuarioRepository.getToken(dados.id))

        if(!usuarioToken || (dados.token == usuarioToken))
            throw new ErrorApp(401, "Token inválido");

        req.usuarioId = dados.id;

        next();

    } catch {
        return res.status(401).json({
            mensagem: 'Token inválido'
        });
    }
}