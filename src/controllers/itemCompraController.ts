import { Request, Response } from 'express';
import { ItemCompraService } from '../services/itemCompraService';

export class ItemCompraController {
    itemCompraService = new ItemCompraService();

    async listaItens(req: Request, res: Response) {
        try {
            const itens = await this.itemCompraService.listaItens(Number(req.params.id_cliente), Number(req.params.id_compra));
            res.status(200).json(itens);
        } catch (erro) {
            if (erro instanceof Error && (erro.cause === 400 || erro.cause === 404)) {
                res.status(erro.cause).json({ message: erro.message });
            } else {
                console.error(erro);
                res.status(500).json({ message: 'Erro ao consultar itens da compra.' });
            }
        }
    }
}
