import { Usuario } from "../models/Usuario";
import { executarComandoSQL } from "../database/mysql";
import { createHash } from "node:crypto";

export class UsuarioRepository {
    private static instance: UsuarioRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS usuario (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            token VARCHAR(512) NOT NULL,
            nome VARCHAR(100) NOT NULL,
            telefone VARCHAR(20),
            adm BOOLEAN NOT NULL DEFAULT FALSE,
            link_imagem VARCHAR(500)
        ) ENGINE=InnoDB;
        `;
    }

    private constructor() { }

    public static getInstance(): UsuarioRepository {
        if (!this.instance) {
            this.instance = new UsuarioRepository();
        }
        return this.instance;
    }

    private mapearUsuario(linha: any): Usuario {
        return new Usuario(
            linha.id_cliente,
            linha.email,
            linha.senha ?? "",
            linha.token ?? "",
            linha.nome,
            linha.telefone ?? null,
            Boolean(linha.adm),
            linha.link_imagem ?? null
        );
    }

    async listaUsuarios(): Promise<Usuario[]> {
        const linhas = await executarComandoSQL(
            `SELECT id_cliente, email, nome, telefone, adm, link_imagem
             FROM usuario`,
            []
        );

        const usuarios: Usuario[] = linhas.map((linha: any) => {
            return this.mapearUsuario(linha);
        });

        return usuarios;
    }

    async listaUsuarioPorId(id: number): Promise<Usuario | null> {
        const resultado = await executarComandoSQL(
            `SELECT id_cliente, email, nome, telefone, adm, link_imagem
             FROM usuario
             WHERE id_cliente = ?`,
            [id]
        );

        return resultado.length > 0 ? this.mapearUsuario(resultado[0]) : null;
    }

    async listaUsuarioPorEmail(email: string): Promise<Usuario | null> {
        const resultado = await executarComandoSQL(
            "SELECT * FROM usuario WHERE email = ?",
            [email]
        );

        return resultado.length > 0 ? this.mapearUsuario(resultado[0]) : null;
    }

    async existeUsuarioPorEmail(email: string): Promise<boolean> {
        const resultado = await executarComandoSQL(
            "SELECT id_cliente FROM usuario WHERE email = ?",
            [email]
        );

        return resultado.length > 0;
    }

    async cadastraUsuario(usuario: Usuario): Promise<Usuario | null> {
        await executarComandoSQL(
            `INSERT INTO usuario
                (email, senha, token, nome, telefone, link_imagem)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                usuario.email,
                usuario.senha,
                usuario.token ?? "",
                usuario.nome,
                usuario.telefone ?? null,
                usuario.link_imagem ?? null
            ]
        );

        const resultado = await executarComandoSQL(
            `SELECT id_cliente, email, nome, telefone, adm, link_imagem
             FROM usuario
             WHERE id_cliente = LAST_INSERT_ID()`,
            []
        );

        return resultado.length > 0 ? this.mapearUsuario(resultado[0]) : null;
    }

    async atualizarUsuario(usuarioAtualizado: Usuario): Promise<boolean> {
        await executarComandoSQL(
            `UPDATE usuario
             SET
                 email = ?,
                 nome = ?,
                 telefone = ?
             WHERE id_cliente = ?`,
            [
                usuarioAtualizado.email,
                usuarioAtualizado.nome,
                usuarioAtualizado.telefone ?? null,
                usuarioAtualizado.id_cliente
            ]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_cliente FROM usuario WHERE id_cliente = ?",
            [usuarioAtualizado.id_cliente]
        );

        return resultado.length > 0;
    }

    async atualizarSenha(id: number, senhaHash: string): Promise<boolean> {
        await executarComandoSQL(
            "UPDATE usuario SET senha = ? WHERE id_cliente = ?",
            [senhaHash, id]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_cliente FROM usuario WHERE id_cliente = ?",
            [id]
        );

        return resultado.length > 0;
    }

    async atualizarToken(id: number): Promise<boolean> {
        const token = createHash(new Date().toISOString()+id)

        await executarComandoSQL(
            "UPDATE usuario SET token = ? WHERE id_cliente = ?",
            [token, id]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_cliente FROM usuario WHERE id_cliente = ?",
            [id]
        );

        return resultado.length > 0;
    }

    async encerrarSessao(id: number): Promise<boolean> {
        return await this.atualizarToken(id);
    }

    async atualizarImagemPerfil(id: number, linkImagem: string | null): Promise<boolean> {
        await executarComandoSQL(
            "UPDATE usuario SET link_imagem = ? WHERE id_cliente = ?",
            [linkImagem, id]
        );

        const resultado = await executarComandoSQL(
            "SELECT id_cliente FROM usuario WHERE id_cliente = ?",
            [id]
        );

        return resultado.length > 0;
    }
}