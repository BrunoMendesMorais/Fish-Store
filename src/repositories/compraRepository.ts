
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { banco } from '../database/mysql'
import { Compra } from '../models/compra'
import { ItemCompra } from '../models/itemCompra'
import { CarrinhoRepository } from './carrinhoRepository'
import { ItemCompraRepository } from './itemCompraRepository'

export class CompraRepository {
    private static instance: CompraRepository
    private constructor() {}

    public static getInstance(): CompraRepository {
        if (!this.instance) {
            this.instance = new CompraRepository()
        }
        return this.instance
    }

    carrinhoRepository = CarrinhoRepository.getInstance()
    itemCompraRepository = ItemCompraRepository.getInstance()

    async finalizaCompra(id_cliente: number): Promise<Compra | undefined> {
        const conexao = await banco.getConnection()

        try {
            await conexao.beginTransaction()

            const itens = await this.carrinhoRepository.listaItens(id_cliente, conexao)

            if (itens.length === 0) {
                await conexao.rollback()
                return undefined
            }

            const [resultado] = await conexao.execute<ResultSetHeader>(
                "INSERT INTO Compra (id_cliente, data) VALUES (?, CURRENT_TIMESTAMP)",
                [id_cliente]
            )

            const idGerado = resultado.insertId

            for (const item of itens) {
                const novoItem = new ItemCompra(
                    0,
                    idGerado,
                    item.id_produto,
                    item.quantidade
                )

                await this.itemCompraRepository.insereItem(novoItem, conexao)
            }

            await this.carrinhoRepository.limpaCarrinho(id_cliente, conexao)

            const [linhas] = await conexao.execute<RowDataPacket[]>(
                "SELECT * FROM Compra WHERE id_compra = ?",
                [idGerado]
            )

            if (linhas.length === 0) {
                throw new Error("Compra não encontrada após inserção.")
            }

            const linha = linhas[0]

            const novaCompra = new Compra(
                linha.id_compra,
                linha.id_cliente,
                linha.data
            )

            await conexao.commit()

            return novaCompra

        } catch (error) {
            await conexao.rollback()
            throw error
        } finally {
            conexao.release()
        }
    }

    async listaCompras(id_cliente: number): Promise<Compra[]> {
        const [linhas] = await banco.execute<RowDataPacket[]>(
            "SELECT * FROM Compra WHERE id_cliente = ? ORDER BY id_compra",
            [id_cliente]
        )

        const compras: Compra[] = linhas.map((linha: any) => {
            return new Compra(
                linha.id_compra,
                linha.id_cliente,
                linha.data
            )
        })

        return compras
    }

    async listaCompraID(id_cliente: number, id_compra: number): Promise<Compra | undefined> {
        const [linhas] = await banco.execute<RowDataPacket[]>(
            "SELECT * FROM Compra WHERE id_compra = ? AND id_cliente = ?",
            [id_compra, id_cliente]
        )

        if (linhas.length === 0) {
            return undefined
        }

        const linha = linhas[0]

        return new Compra(
            linha.id_compra,
            linha.id_cliente,
            linha.data
        )
    }
}
