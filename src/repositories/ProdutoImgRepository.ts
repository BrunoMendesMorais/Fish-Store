import { ProdutoImg } from "../models/ProdutoImg";
import { executarComandoSQL } from "../database/mysql";

export class ProdutoImgRepository {
    private static instance: ProdutoImgRepository
    
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS produto_img (
            id_img_produto INT AUTO_INCREMENT PRIMARY KEY,
            id_produto INT NOT NULL,
            url_img VARCHAR(500) NOT NULL,
            capa BOOLEAN NOT NULL DEFAULT FALSE,

            CONSTRAINT fk_produto_img_produto
                FOREIGN KEY (id_produto)
                REFERENCES produto(id_produto)
        ) ENGINE=InnoDB;
        `;
    }

    private constructor(){}

    public static getInstance(): ProdutoImgRepository{
        if (!this.instance) {
            this.instance = new ProdutoImgRepository();
        }
        return this.instance;
    }

    private mapearImagem(linha: any): ProdutoImg {
        return new ProdutoImg(
            linha.id_img_produto,
            linha.id_produto,
            linha.url_img,
            Boolean(linha.capa)
        );
    }

    async listaImagensPorProduto(id_produto: number): Promise<ProdutoImg[]> {
        const linhas = await executarComandoSQL(
            `SELECT * FROM produto_img WHERE id_produto = ?`,
            [id_produto]
        );

        return linhas.map((linha: any) => this.mapearImagem(linha));
    }

    async listaImagemPorId(id_img_produto: number): Promise<ProdutoImg | null> {
        const resultado = await executarComandoSQL(
            `SELECT * FROM produto_img WHERE id_img_produto = ?`,
            [id_img_produto]
        );

        return resultado.length > 0 ? this.mapearImagem(resultado[0]) : null;
    }

    async cadastraImagem(imagem: ProdutoImg): Promise<ProdutoImg | null> {
        await executarComandoSQL(
            `INSERT INTO produto_img (id_produto, url_img, capa)
             VALUES (?, ?, ?)`,
            [imagem.id_produto, imagem.url_img, imagem.capa]
        );

        const resultado = await executarComandoSQL(
            `SELECT * FROM produto_img WHERE id_img_produto = LAST_INSERT_ID()`,
            []
        );

        return resultado.length > 0 ? this.mapearImagem(resultado[0]) : null;
    }

    async deletarImagem(id_img_produto: number): Promise<boolean> {
        await executarComandoSQL(
            "DELETE FROM produto_img WHERE id_img_produto = ?",
            [id_img_produto]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_img_produto FROM produto_img WHERE id_img_produto = ?",
            [id_img_produto]
        );

        return resultado.length === 0;
    }

    async deletarImagensPorProduto(id_produto: number): Promise<boolean> {
        await executarComandoSQL(
            "DELETE FROM produto_img WHERE id_produto = ?",
            [id_produto]
        );

        return true;
    }
}
