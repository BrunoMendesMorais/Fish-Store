import { Request, Response } from 'express';
import { CompraService } from '../services/compraService';
import { ErrorApp } from '../models/Error';

export class CompraController {
    compraService = new CompraService();

    // async finalizaCompra(req: Request, res: Response) {
    //     try {
    //         const compra = await this.compraService.finalizaCompra(Number(req.params.id_cliente));
    //         res.status(201).json(compra);
    //     } catch (erro) {
    //         if (erro instanceof Error && (erro.cause === 400 || erro.cause === 409)) {
    //             res.status(erro.cause).json({ message: erro.message });
    //         } else {
    //             console.error(erro);
    //             res.status(500).json({ message: 'Erro ao finalizar compra.' });
    //         }
    //     }
    // }

    async listaCompras(req: Request, res: Response) {
        try {
            const compras = await this.compraService.listaCompras(Number(req.params.id_cliente));
            res.status(200).json(compras);
        } catch (erro) {
            if(erro instanceof ErrorApp)
                res.status(erro.status).json(erro.message)
            else {
                console.error(erro);
                res.status(500).json({ message: 'Erro do servidor.' });
            }
        }
    }

    async listaCompraID(req: Request, res: Response) {
        try {
            const compra = await this.compraService.listaCompraID(Number(req.params.id_cliente), Number(req.params.id_compra));
            res.status(200).json(compra);
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
