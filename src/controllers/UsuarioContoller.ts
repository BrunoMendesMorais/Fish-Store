import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

export class UsuarioController {
    async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, email, senha, telefone } = req.body;

            if (
                typeof nome !== 'string' || !nome.trim() ||
                typeof email !== 'string' || !email.trim() ||
                typeof senha !== 'string' || !senha
            ) {
                return res.status(400).json({
                    mensagem: 'Nome, e-mail e senha são obrigatórios.'
                });
            }

            const usuario = await UsuarioService.cadastrar(
                nome.trim(),
                email.trim(),
                senha,
                typeof telefone === 'string' && telefone.trim()
                    ? telefone.trim()
                    : undefined
            );

            return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso.',usuario});
        } catch (erro: unknown) {
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao cadastrar usuário.';

            const status = mensagem === 'E-mail já cadastrado' ? 409 : 500;

            return res.status(status).json({ mensagem });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, senha } = req.body;

            if (
                typeof email !== 'string' || !email.trim() ||
                typeof senha !== 'string' || !senha
            ) {
                return res.status(400).json({
                    mensagem: 'E-mail e senha são obrigatórios.'
                });
            }

            const resultado = await UsuarioService.login(
                email.trim(),
                senha
            );

            return res.status(200).json({
                mensagem: 'Login realizado com sucesso.',
                ...resultado
            });
        } catch (erro: unknown) {
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao realizar login.';

            const status = mensagem === 'Credenciais inválidas' ? 401 : 500;

            return res.status(status).json({ mensagem });
        }
    }
}

export const usuarioController = new UsuarioController();
