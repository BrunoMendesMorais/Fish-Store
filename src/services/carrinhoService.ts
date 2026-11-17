import { Carrinho } from '../models/carrinho';
import { CarrinhoRepository } from '../repositories/carrinhoRepository';

export class CarrinhoService {
    carrinhoRepository = CarrinhoRepository.getInstance()


    async insereItem(id_cliente: number, dados: Carrinho): Promise<Carrinho> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!dados || !Number.isInteger(dados.id_produto) || dados.id_produto <= 0 || dados.id_produto > 2147483647) {
            throw new Error('id_produto deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0 || dados.quantidade > 2147483647) {
            throw new Error('quantidade deve ser um inteiro positivo valido.', { cause: 400 });
        }

        const item = new Carrinho(0, id_cliente, dados.id_produto, dados.quantidade);
        return this.carrinhoRepository.insereItem(item);
    }

    async listaItens(id_cliente: number): Promise<Carrinho[]> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
        }
        return this.carrinhoRepository.listaItens(id_cliente);
    }

    async atualizaQuantidade(id_cliente: number, id_item: number, dados: Carrinho): Promise<void> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!Number.isInteger(id_item) || id_item <= 0 || id_item > 2147483647) {
            throw new Error('id_item deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!dados || !Number.isInteger(dados.quantidade) || dados.quantidade <= 0 || dados.quantidade > 2147483647) {
            throw new Error('quantidade deve ser um inteiro positivo valido.', { cause: 400 });
        }
        const atualizado = await this.carrinhoRepository.atualizaQuantidade(id_cliente, id_item, dados.quantidade);
        if (!atualizado) {
            throw new Error('Item do carrinho nao encontrado.', { cause: 404 });
        }
    }

    async removeItem(id_cliente: number, id_item: number): Promise<void> {
        if (!Number.isInteger(id_cliente) || id_cliente <= 0 || id_cliente > 2147483647) {
            throw new Error('id_cliente deve ser um inteiro positivo valido.', { cause: 400 });
        }
        if (!Number.isInteger(id_item) || id_item <= 0 || id_item > 2147483647) {
            throw new Error('id_item deve ser um inteiro positivo valido.', { cause: 400 });
        }
        const removido = await this.carrinhoRepository.removeItem(id_cliente, id_item);
        if (!removido) {
            throw new Error('Item do carrinho nao encontrado.', { cause: 404 });
        }
    }
}
