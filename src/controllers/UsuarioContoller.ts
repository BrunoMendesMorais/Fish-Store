import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';
import { ErrorApp } from '../models/Error'

export class UsuarioController {

    async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, email, senha, telefone } = req.body;

            if ( typeof nome !== 'string' || !nome.trim() || typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha) {
                return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios.' });
            }

            const usuario = await UsuarioService.cadastrar(
                nome.trim(),
                email.trim(),
                senha,
                telefone
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

    async login(req: Request, res: Response) {

        try {
            const { email, senha } = req.body;

            if(!email.trim() || !senha.trim()){
                throw new ErrorApp(422,"Email e senha são Obrigatorios")
            }

            const resultado = await UsuarioService.login(email, senha);

            if(!resultado)
                throw new ErrorApp(422,"Email e senha são Obrigatorios")

            res.cookie('token', resultado.tokenSessao, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 60 

            });
            return res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario: resultado});

        } catch (error: any) {
            return res.status(error.status ?? 500).json({message: error.mensagem ?? "Internal Server Error"});
        }
    }

    async logout( req: Request, res: Response){
        try {
            const { email } = req.body;
            const token = req.cookies?.token

            if(!email.trim() || !token){
                throw new ErrorApp(422,"sessão invalida")
            }

            const resultado = await UsuarioService.logout(email);

            res.cookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 60 

            });
            return res.status(204).json({ mensagem: 'Logout realizado com sucesso',});

        } catch (error: any) {
            return res.status(error.status ?? 500).json({message: error.mensagem ?? "Internal Server Error"});
        }
    }
    
    async listar(req: Request, res:Response){

    }
    async atualizaImagem(req: Request, res: Response){

    }
    async atualizar(req: Request, res: Response){
        
    }
}

export const usuarioController = new UsuarioController();
