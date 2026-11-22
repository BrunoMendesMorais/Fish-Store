import { Request, Response } from 'express';
import { CarrinhoService } from '../services/carrinhoService';

export class CarrinhoController {
    carrinhoService = new CarrinhoService();

    async insereItem(req: Request, res: Response) {
        try {
            const item = await this.carrinhoService.insereItem(Number(req.params.id_cliente), req.body);
            res.status(201).json(item);
        } catch (erro) {
            if (erro instanceof Error && erro.cause === 400) {
                res.status(400).json({ message: erro.message });
            } else {
                console.error(erro);
                res.status(500).json({ message: 'Erro ao adicionar item ao carrinho.' });
            }
        }
    }

    async listaItens(req: Request, res: Response) {
        try {
            const itens = await this.carrinhoService.listaItens(Number(req.params.id_cliente));
            res.status(200).json(itens);
        } catch (erro) {
            if (erro instanceof Error && erro.cause === 400) {
                res.status(400).json({ message: erro.message });
            } else {
                console.error(erro);
                res.status(500).json({ message: 'Erro ao listar itens do carrinho.' });
            }
        }
    }

    async atualizaQuantidade(req: Request, res: Response) {
        try {
            await this.carrinhoService.atualizaQuantidade(Number(req.params.id_cliente), Number(req.params.id_item), req.body);
            res.status(204).end();
        } catch (erro) {
            if (erro instanceof Error && (erro.cause === 400 || erro.cause === 404)) {
                res.status(erro.cause).json({ message: erro.message });
            } else {
                console.error(erro);
                res.status(500).json({ message: 'Erro ao alterar quantidade.' });
            }
        }
    }

    async removeItem(req: Request, res: Response) {
        try {
            await this.carrinhoService.removeItem(Number(req.params.id_cliente), Number(req.params.id_item));
            res.status(204).end();
        } catch (erro) {
            if (erro instanceof Error && (erro.cause === 400 || erro.cause === 404)) {
                res.status(erro.cause).json({ message: erro.message });
            } else {
                console.error(erro);
                res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
            }
        }
    }
}
