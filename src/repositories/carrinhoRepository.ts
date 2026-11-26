
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { executarComandoSQL } from '../database/mysql';
import { Carrinho } from '../models/carrinho';

export class CarrinhoRepository {
    private static instance: CarrinhoRepository;

    private constructor() {}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS carrinho_itens (
            id_item INT AUTO_INCREMENT PRIMARY KEY,
            id_produto INT NOT NULL,
            id_cliente INT NOT NULL,
            quantidade INT NOT NULL DEFAULT 1,

            CONSTRAINT fk_carrinho_produto
                FOREIGN KEY (id_produto)
                REFERENCES produto(id_produto),

            CONSTRAINT fk_carrinho_usuario
                FOREIGN KEY (id_cliente)
                REFERENCES usuario(id_cliente)
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): CarrinhoRepository {
        if (!this.instance) {
            this.instance = new CarrinhoRepository();
        }

        return this.instance;
    }

    async insereItem(carrinho: Carrinho): Promise<Carrinho> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `INSERT INTO carrinho_itens
            (id_cliente, id_produto, quantidade)
            VALUES (?, ?, ?)`,
            [
                carrinho.id_cliente,
                carrinho.id_produto,
                carrinho.quantidade
            ]
        );

        return new Carrinho(
            resultado.insertId,
            carrinho.id_cliente,
            carrinho.id_produto,
            carrinho.quantidade
        );
    }

    async listaItens(id_cliente: number, conexao?: PoolConnection): Promise<Carrinho[]> {
        let sql = `
            SELECT * FROM carrinho_itens
            WHERE id_cliente = ?
            ORDER BY id_item
        `;

        if (conexao) {
            sql += ' FOR UPDATE';
        }

        const linhas = await executarComandoSQL<RowDataPacket[]>(sql,[id_cliente],conexao);

        return linhas.map((linha) => {
            return new Carrinho(
                linha.id_item,
                linha.id_cliente,
                linha.id_produto,
                linha.quantidade
            );
        });
    }

    async atualizaQuantidade(id_cliente: number,id_item: number,quantidade: number): Promise<boolean> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `UPDATE carrinho_itens
            SET quantidade = ?
            WHERE id_item = ? AND id_cliente = ?`,
            [quantidade, id_item, id_cliente]
        );

        return resultado.affectedRows > 0;
    }

    async removeItem(id_cliente: number,id_item: number): Promise<boolean> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `DELETE FROM carrinho_itens
            WHERE id_item = ? AND id_cliente = ?`,
            [id_item, id_cliente]
        );

        return resultado.affectedRows > 0;
    }

    async limpaCarrinho(id_cliente: number,conexao: PoolConnection): Promise<void> {
        await executarComandoSQL(
            `DELETE FROM carrinho_itens WHERE id_cliente = ?`,
            [id_cliente], conexao
        );
    }
}
