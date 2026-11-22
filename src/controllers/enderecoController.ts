import { Request, Response } from 'express';
import { EnderecoService } from '../services/enderecoService';

export class EnderecoController {
    enderecoService = new EnderecoService();

    // Erros de validação (400) e não encontrado (404) vão para o cliente; o resto vira 500
    private trataErro(res: Response, erro: unknown, mensagemPadrao: string) {
        if (erro instanceof Error && (erro.cause === 400 || erro.cause === 404)) {
            res.status(erro.cause).json({ message: erro.message });
        } else {
            console.error(erro);
            res.status(500).json({ message: mensagemPadrao });
        }
    }

    async insereEndereco(req: Request, res: Response) {
        try {
            const endereco = await this.enderecoService.insereEndereco(Number(req.params.id_cliente), req.body);
            res.status(201).json(endereco);
        } catch (erro) {
            this.trataErro(res, erro, 'Erro ao cadastrar endereco.');
        }
    }

    async listaEnderecos(req: Request, res: Response) {
        try {
            const enderecos = await this.enderecoService.listaEnderecos(Number(req.params.id_cliente));
            res.status(200).json(enderecos);
        } catch (erro) {
            this.trataErro(res, erro, 'Erro ao listar enderecos.');
        }
    }

    async buscaEnderecoID(req: Request, res: Response) {
        try {
            const endereco = await this.enderecoService.buscaEnderecoID(
                Number(req.params.id_cliente),
                Number(req.params.id_endereco)
            );
            res.status(200).json(endereco);
        } catch (erro) {
            this.trataErro(res, erro, 'Erro ao consultar endereco.');
        }
    }

    async atualizaEndereco(req: Request, res: Response) {
        try {
            await this.enderecoService.atualizaEndereco(
                Number(req.params.id_cliente),
                Number(req.params.id_endereco),
                req.body
            );
            res.status(204).end();
        } catch (erro) {
            this.trataErro(res, erro, 'Erro ao atualizar endereco.');
        }
    }

    async removeEndereco(req: Request, res: Response) {
        try {
            await this.enderecoService.removeEndereco(
                Number(req.params.id_cliente),
                Number(req.params.id_endereco)
            );
            res.status(204).end();
        } catch (erro) {
            this.trataErro(res, erro, 'Erro ao excluir endereco.');
        }
    }
}