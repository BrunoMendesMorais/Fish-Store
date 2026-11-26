import { ItemCompra } from '../models/ItemCompra';
import { CompraRepository } from '../repositories/compraRepository';
import { ItemCompraRepository } from '../repositories/itemCompraRepository';

export class ItemCompraService {
    compraRepository = CompraRepository.getInstance()
    itemCompraRepository = ItemCompraRepository.getInstance()


    async listaItens(id_cliente: number, id_compra: number): Promise<ItemCompra[]> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!Number.isInteger(id_compra) || id_compra <= 0 || id_compra > 2147483647) {
            throw new Error('id_compra deve ser um inteiro positivo valido.', { cause: 400 });
        }
        const compra = await this.compraRepository.listaCompraID(id_cliente, id_compra);
        if (!compra) {
            throw new Error('Compra nao encontrada.', { cause: 404 });
        }
        return this.itemCompraRepository.listaItens(id_compra);
    }
}
