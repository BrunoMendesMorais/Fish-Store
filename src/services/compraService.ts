import { Compra } from '../models/compra';
import { CompraRepository } from '../repositories/compraRepository';
import { ErrorApp } from '../models/Error';

export class CompraService {
    compraRepository = CompraRepository.getInstance()


    // async finalizaCompra(id_cliente: number): Promise<Compra> {
    //     if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
    //         throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
    //     }
    //     const compra = await this.compraRepository.finalizaCompra(id_cliente);
    //     if (!compra) {
    //         throw new Error('O carrinho esta vazio.', { cause: 409 });
    //     }
    //     return compra;
    // }

    async listaCompras(id_cliente: number): Promise<Compra[]> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new ErrorApp(400,'id_cliente deve ser um inteiro positivo valido.');
        }
        return this.compraRepository.listaCompras(id_cliente);
    }

    async listaCompraID(id_cliente: number, id_compra: number): Promise<Compra> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new ErrorApp(400,'id_cliente deve ser um inteiro positivo valido.');
        }
        if (!Number.isInteger(id_compra) || id_compra <= 0 || id_compra > 2147483647) {
            throw new ErrorApp(400,'id_cliente deve ser um inteiro positivo valido.');
        }
        const compra = await this.compraRepository.listaCompraID(id_cliente, id_compra);
        if (!compra) {
            throw new ErrorApp(400,'id_cliente deve ser um inteiro positivo valido.');
        }
        return compra;
    }

    async atualizaStatus(id_compra: number){}
}
