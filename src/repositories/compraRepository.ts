
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { banco, executarComandoSQL } from '../database/mysql';
import { Compra } from '../models/compra';
import { ItemCompra } from '../models/itemCompra';
import { CarrinhoRepository } from './carrinhoRepository';
import { ItemCompraRepository } from './itemCompraRepository';

export class CompraRepository {
    private static instance: CompraRepository;
    private constructor() {}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS compra (
            id_compra INT AUTO_INCREMENT PRIMARY KEY,
            id_cliente INT NOT NULL,
            data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(30) NOT NULL DEFAULT 'pendente',
            valor_total DECIMAL(10,2) NOT NULL,
            sub_total DECIMAL(10,2) NOT NULL,
            valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            id_pagamento INT NOT NULL,

            CONSTRAINT fk_compra_usuario
                FOREIGN KEY (id_cliente)
                REFERENCES usuario(id_cliente),

            CONSTRAINT fk_compra_tipo_pagamento
                FOREIGN KEY (id_pagamento)
                REFERENCES tipo_pagamento(id_pagamento)
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): CompraRepository {
        if (!this.instance) {
            this.instance = new CompraRepository();
        }

        return this.instance;
    }

    carrinhoRepository = CarrinhoRepository.getInstance();
    itemCompraRepository = ItemCompraRepository.getInstance();

    // async finalizaCompra( id_cliente: number): Promise<Compra | undefined> {
    //     const conexao = await banco.getConnection();
    //     try {
    //         await conexao.beginTransaction();
    //         const itens = await this.carrinhoRepository.listaItens(
    //             id_cliente,
    //             conexao
    //         );

    //         if (itens.length === 0) {
    //             await conexao.rollback();
    //             return undefined;
    //         }

    //         const resultado = await executarComandoSQL<ResultSetHeader>(
    //             `INSERT INTO compra (id_cliente, data)
    //             VALUES (?, CURRENT_TIMESTAMP)`,
    //             [id_cliente],
    //             conexao
    //         );

    //         const idGerado = resultado.insertId;

    //         for (const item of itens) {
    //             const novoItem = new ItemCompra(
    //                 item.id_produto,
    //                 idGerado,
    //                 item.quantidade,
    //             );

    //             await this.itemCompraRepository.insereItem(
    //                 novoItem,
    //                 conexao
    //             );
    //         }

    //         await this.carrinhoRepository.limpaCarrinho(
    //             id_cliente,
    //             conexao
    //         );

    //         const linhas = await executarComandoSQL<RowDataPacket[]>(
    //             `SELECT * FROM compra WHERE id_compra = ?`,
    //             [idGerado],
    //             conexao
    //         );

    //         if (linhas.length === 0) {
    //             throw new Error(
    //                 'Compra não encontrada após inserção.'
    //             );
    //         }

    //         const linha = linhas[0];

    //         const novaCompra = new Compra(
    //             linha.id_compra,
    //             linha.id_cliente,
    //             linha.data,
    //             linha.status,
    //             linha.valor_total,
    //             linha.sub_total,
    //             linha.valorFrete,
    //             linha.id_pagamento
    //         );

    //         await conexao.commit();

    //         return novaCompra;

    //     } catch (error) {
    //         await conexao.rollback();
    //         throw error;

    //     } finally {
    //         conexao.release();
    //     }
    // }

    async listaCompras(id_cliente: number): Promise<Compra[]> {

        const linhas = await executarComandoSQL<RowDataPacket[]>(
            `SELECT * FROM compra
            WHERE id_cliente = ?
            ORDER BY id_compra`,
            [id_cliente]
        );

        return linhas.map((linha) => {
            return new Compra(
                linha.id_compra,
                linha.id_cliente,
                linha.data,
                linha.status,
                linha.valor_total,
                linha.sub_total,
                linha.valorFrete,
                linha.id_pagamento
            );
        });
    }

    async listaCompraID(
        id_cliente: number,
        id_compra: number
    ): Promise<Compra | undefined> {

        const linhas = await executarComandoSQL<RowDataPacket[]>(
            `SELECT * FROM compra
            WHERE id_compra = ? AND id_cliente = ?`,
            [id_compra, id_cliente]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];

        return new Compra(
            linha.id_compra,
            linha.id_cliente,
            linha.data,
            linha.status,
            linha.valor_total,
            linha.sub_total,
            linha.valorFrete,
            linha.id_pagamento
        );
    }

    async atualizaStatus(){
        
    }
}
