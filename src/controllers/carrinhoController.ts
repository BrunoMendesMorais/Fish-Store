import { Request, Response } from 'express';
import { CarrinhoService } from '../services/carrinhoService';
import { ErrorApp } from '../models/Error'

export class CarrinhoController {
    carrinhoService = new CarrinhoService();

    async insereItem(req: Request, res: Response) {
        try {
            const item = await this.carrinhoService.insereItem(Number(req.params.id_cliente), req.body);
            res.status(201).json(item);
        } catch (erro) {
            if(erro instanceof ErrorApp)
                res.status(erro.status).json(erro.message)
            else {
                console.error(erro);
                res.status(500).json({ message: 'Erro do servidor.' });
            }
        }
    }

    async listaItens(req: Request, res: Response) {
        try {
            const itens = await this.carrinhoService.listaItens(Number(req.params.id_cliente));
            res.status(200).json(itens);
        } catch (erro) {
            if(erro instanceof ErrorApp)
                res.status(erro.status).json(erro.message)
            else {
                console.error(erro);
                res.status(500).json({ message: 'Erro do servidor.' });
            }
        }
    }

    async atualizaQuantidade(req: Request, res: Response) {
        try {
            await this.carrinhoService.atualizaQuantidade(Number(req.params.id_cliente), Number(req.params.id_item), req.body);
            res.status(204).end();
        } catch (erro) {
            if(erro instanceof ErrorApp)
                res.status(erro.status).json(erro.message)
            else {
                console.error(erro);
                res.status(500).json({ message: 'Erro do servidor.' });
            }
        }
    }

    async removeItem(req: Request, res: Response) {
        try {
            await this.carrinhoService.removeItem(Number(req.params.id_cliente), Number(req.params.id_item));
            res.status(204).end();
        } catch (erro) {
            if(erro instanceof ErrorApp)
                res.status(erro.status).json(erro.message)
            else {
                console.error(erro);
                res.status(500).json({ message: 'Erro do servidor.' });
            }
        }
    }
}
