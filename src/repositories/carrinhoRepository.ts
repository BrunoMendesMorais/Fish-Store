
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { banco } from '../database/mysql'
import { Carrinho } from '../models/carrinho'

export class CarrinhoRepository {
    private static instance: CarrinhoRepository
    private constructor() {}

    public static getInstance(): CarrinhoRepository {
        if (!this.instance) {
            this.instance = new CarrinhoRepository()
        }
        return this.instance
    }

    async insereItem(carrinho: Carrinho): Promise<Carrinho> {
        const [resultado] = await banco.execute<ResultSetHeader>(
            "INSERT INTO CarrinhoItens (id_cliente, id_produto, quantidade) VALUES (?, ?, ?)",
            [carrinho.id_cliente, carrinho.id_produto, carrinho.quantidade]
        )

        const novoItem = new Carrinho(
            resultado.insertId,
            carrinho.id_cliente,
            carrinho.id_produto,
            carrinho.quantidade
        )

        return novoItem
    }

    async listaItens(id_cliente: number, conexao?: PoolConnection): Promise<Carrinho[]> {
        let sql = "SELECT * FROM CarrinhoItens WHERE id_cliente = ? ORDER BY id_item"

        if (conexao) {
            sql += " FOR UPDATE"
        }

        const [linhas] = await (conexao ?? banco).execute<RowDataPacket[]>(sql, [id_cliente])

        const itens: Carrinho[] = linhas.map((linha: any) => {
            return new Carrinho(
                linha.id_item,
                linha.id_cliente,
                linha.id_produto,
                linha.quantidade
            )
        })

        return itens
    }

    async atualizaQuantidade(id_cliente: number, id_item: number, quantidade: number): Promise<boolean> {
        const [resultado] = await banco.execute<ResultSetHeader>(
            "UPDATE CarrinhoItens SET quantidade = ? WHERE id_item = ? AND id_cliente = ?",
            [quantidade, id_item, id_cliente]
        )

        return resultado.affectedRows > 0
    }

    async removeItem(id_cliente: number, id_item: number): Promise<boolean> {
        const [resultado] = await banco.execute<ResultSetHeader>(
            "DELETE FROM CarrinhoItens WHERE id_item = ? AND id_cliente = ?",
            [id_item, id_cliente]
        )

        return resultado.affectedRows > 0
    }

    async limpaCarrinho(id_cliente: number, conexao: PoolConnection): Promise<void> {
        await conexao.execute(
            "DELETE FROM CarrinhoItens WHERE id_cliente = ?",
            [id_cliente]
        )
    }
}
