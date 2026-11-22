
import { PoolConnection, RowDataPacket } from 'mysql2/promise'
import banco  from '../database/mysql'
import { ItemCompra } from '../models/itemCompra'

export class ItemCompraRepository {
    private static instance: ItemCompraRepository
    private constructor() {}

     static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS item_compra (
            id_item INT AUTO_INCREMENT PRIMARY KEY,
            id_compra INT NOT NULL,
            id_produto INT NOT NULL,
            quantidade INT NOT NULL,
            preco_unidade DECIMAL(10,2) NOT NULL,
            desconto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            preco_total_produto DECIMAL(10,2) NOT NULL,

            CONSTRAINT fk_item_compra_compra
                FOREIGN KEY (id_compra)
                REFERENCES compra(id_compra),

            CONSTRAINT fk_item_compra_produto
                FOREIGN KEY (id_produto)
                REFERENCES produto(id_produto)
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): ItemCompraRepository {
        if (!this.instance) {
            this.instance = new ItemCompraRepository()
        }
        return this.instance
    }

    async insereItem(item: ItemCompra, conexao: PoolConnection): Promise<void> {
        await conexao.execute(
            "INSERT INTO Item_Compra (id_compra, id_produto, quantidade) VALUES (?, ?, ?)",
            [item.id_compra, item.id_produto, item.quantidade]
        )
    }

    async listaItens(id_compra: number): Promise<ItemCompra[]> {
        const [linhas] = await banco.execute<RowDataPacket[]>(
            "SELECT * FROM Item_Compra WHERE id_compra = ? ORDER BY id_item",
            [id_compra]
        )

        const itens: ItemCompra[] = linhas.map((linha: any) => {
            return new ItemCompra(
                linha.id_item,
                linha.id_compra,
                linha.id_produto,
                linha.quantidade
            )
        })

        return itens
    }
}
