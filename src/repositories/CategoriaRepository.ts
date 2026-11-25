import { promises } from "node:dns";
import { Categoria } from "../models/Categoria";
import { executarComandoSQL } from "../database/mysql";


export class CategoriaRepository {
    private static instance: CategoriaRepository

    private constructor() {}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS categoria (
            id_categoria INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): CategoriaRepository{
        if(!this.instance){
            this.instance =  new CategoriaRepository;
        }
        return this.instance;
    }

    private mapearCategoria(linha: any): Categoria {
        return new Categoria(
            linha.id_categoria,
            linha.nome
        );
    }

    async listaCategorias(): Promise<Categoria[]> {
        const linhas = await executarComandoSQL(
            `SELECT id_categoria, nome
            FROM categoria`,
            []
        );

        const categorias: Categoria[] = linhas.map((linha: any) => {
            return this.mapearCategoria(linha);
        });

        return categorias;
    }

    async listaCategoriaPorId(id: number): Promise <Categoria | null>{
        const resultado = await executarComandoSQL(
            `SELECT id_categoria, nome
            FROM categoria
            WHERE id_categoria = ?`,
            [id]
        );

        return resultado.length > 0 ? this.mapearCategoria(resultado[0]) : null;
    }

    async existeCategoriaPorNome(nome: String): Promise<boolean>{
        const resultado = await executarComandoSQL(
            `SELECT id_categoria from categoria WHERE nome = ?`,
            [nome]
        );

        return resultado.length > 0;
        
    }

    async cadastraCategoria(categoria: Categoria): Promise<Categoria | null>{
        await executarComandoSQL(
            `INSERT INTO categoria (nome)
            VALUES (?)`,
            [categoria.nome]
        );

        const resultado = await executarComandoSQL(
            `SELECT id_categoria, nome
            FROM categoria
            WHERE id_categoria = LAST_INSERT_ID()`,
            []
        );

        return resultado.length > 0 ? this.mapearCategoria(resultado[0]): null;
    }

    async atualizarCategoria(categoria: Categoria): Promise<boolean>{
        await executarComandoSQL(
            `UPDATE categoria
            SET nome = ?
            WHERE id_categoria = ?`,
            [
                categoria.nome,
                categoria.id_categoria
            ]
        );

        const resultado = await executarComandoSQL(
            `SELECT id_categoria
            FROM categoria
            WHERE id_categoria = ?`,
            [categoria.id_categoria]
        );

        return resultado.length > 0;
    }

}
