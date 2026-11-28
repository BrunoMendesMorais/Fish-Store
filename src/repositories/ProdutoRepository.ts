import { Produto } from "../models/Produto";
import { executarComandoSQL } from "../database/mysql";
import { execArgv } from "node:process";

export class ProdutoRepository {
    private static instance: ProdutoRepository

    private constructor(){}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS produto (
            id_produto INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(150) NOT NULL,
            descricao TEXT,
            preco_unidade DECIMAL(10,2) NOT NULL,
            preco_final_unidade DECIMAL(10,2) NOT NULL,
            desconto DECIMAL(10,2) DEFAULT 0.00,
            id_categoria INT NOT NULL,
            estoque INT NOT NULL DEFAULT 0,
            status VARCHAR(30) NOT NULL DEFAULT 'ativo',

            CONSTRAINT fk_produto_categoria
                FOREIGN KEY (id_categoria)
                REFERENCES categoria(id_categoria)
        ) ENGINE=InnoDB;
        `;
    }

    private static getInstance(): ProdutoRepository{
        if(!this.instance){
            this.instance = new ProdutoRepository()
        }
        return this.instance
    }

    private mapearProduto(linha: any): Produto{
        return new Produto(
            linha.id_produto,
            linha.nome,
            linha.descricao ?? null,
            Number(linha.preco_unidade),
            Number(linha.preco_final_unidade),
            Number(linha.desconto),
            linha.id_categoria,
            linha.estoque,
            linha.status
        )
    }

    async listaProduto(): Promise<Produto[]>{
        const linhas = await executarComandoSQL(
            `SELECT * FROM produto`,
            []
        )
        return linhas.map((linha: any) => this.mapearProduto(linha))
    }

    async listaProdutoPorId(id: number): Promise<Produto | null >{
        const resultado = await executarComandoSQL(
            `SELECT * FROM produto WHERE id_produto = ?`
            ,[id]
        )
        return resultado.length > 0 ? this.mapearProduto(resultado[0]) : null
    }

    async listaProdutoPorCategoria(id_categoria: number): Promise<Produto[]>{
        const linhas = await executarComandoSQL(
            `SELECT * FROM produto WHERE id_categoria = ?`,
            [id_categoria]
        )
        return linhas.map((linha: any) => this.mapearProduto(linha))
    }

    async cadastrarProduto(produto: Produto): Promise<Produto | null>{
        await executarComandoSQL(
            `INSERT INTO produto (nome, descricao, preco_unidade, preco_final_unidade, desconto, id_categoria, estoque, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produto.nome,
                produto.descricao ?? null,
                produto.preco_unidade,
                produto.preco_final_unidade,
                produto.desconto,
                produto.id_categoria,
                produto.estoque,
                produto.status
            ]
        )
        const resultado = await executarComandoSQL(
            `SELECT * FROM produto WHERE id_produto = LAST_INSERT_ID()`
        )
        return resultado.length > 0 ? this.mapearProduto(resultado[0]) : null
    }

    async atualizarProduto(produto: Produto): Promise<boolean>{
        await executarComandoSQL(
            `UPDATE produto
             SET
                nome = ?,
                descricao = ?,
                preco_unidade = ?,
                preco_final_unidade = ?,
                desconto = ?,
                id_categoria = ?,
                estoque = ?,
                status = ?
            WHERE id_produto = ?`,
            [
                produto.nome,
                produto.descricao ?? null,
                produto.preco_unidade,
                produto.preco_final_unidade,
                produto.desconto,
                produto.id_categoria,
                produto.estoque,
                produto.status,
                produto.id_produto
            ]
        )
        const resultado = await executarComandoSQL(
            `SELECT id_produto FROM produto WHERE id_produto = ?`,
            [produto.id_produto]
        )
        return resultado.length > 0
    }

    async deletarProduto(id: number): Promise<boolean>{
        await executarComandoSQL(
            "DELETE FROM produto WHERE id_produto = ?",
            [id]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_produto FROM produto WHERE id_produto = ?",
            [id]
        );

        return resultado.length === 0;
    }
}
