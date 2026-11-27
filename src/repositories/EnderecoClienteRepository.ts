import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { executarComandoSQL } from '../database/mysql';
import { EnderecoCliente } from '../models/Endereco';

export class EnderecoClienteRepository {
    private static instance: EnderecoClienteRepository;

    private constructor() {}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS endereco_cliente (
            id_endereco INT AUTO_INCREMENT PRIMARY KEY,
            id_cliente INT NOT NULL,
            cep VARCHAR(9) NOT NULL,
            cidade VARCHAR(100) NOT NULL,
            uf CHAR(2) NOT NULL,
            bairro VARCHAR(100) NOT NULL,
            logradouro VARCHAR(150) NOT NULL,
            numero VARCHAR(20) NOT NULL,

            CONSTRAINT fk_endereco_cliente_usuario
                FOREIGN KEY (id_cliente)
                REFERENCES usuario(id_cliente)
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): EnderecoClienteRepository {
        if (!this.instance) {
            this.instance = new EnderecoClienteRepository();
        }

        return this.instance;
    }

    // Converte uma linha do banco em um objeto EnderecoCliente
    private paraEndereco(linha: RowDataPacket): EnderecoCliente {
        return new EnderecoCliente(
            linha.id_endereco,
            linha.id_cliente,
            linha.cep,
            linha.cidade,
            linha.uf,
            linha.bairro,
            linha.logradouro,
            linha.numero
        );
    }

    async insereEndereco(endereco: EnderecoCliente): Promise<EnderecoCliente> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `INSERT INTO endereco_cliente
            (id_cliente, cep, cidade, uf, bairro, logradouro, numero)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                endereco.id_cliente,
                endereco.cep,
                endereco.cidade,
                endereco.uf,
                endereco.bairro,
                endereco.logradouro,
                endereco.numero
            ]
        );

        return new EnderecoCliente(
            resultado.insertId,
            endereco.id_cliente,
            endereco.cep,
            endereco.cidade,
            endereco.uf,
            endereco.bairro,
            endereco.logradouro,
            endereco.numero
        );
    }

    async listaEnderecos(id_cliente: number): Promise<EnderecoCliente[]> {
        const linhas = await executarComandoSQL<RowDataPacket[]>(
            `SELECT * FROM endereco_cliente
            WHERE id_cliente = ?
            ORDER BY id_endereco`,
            [id_cliente]
        );

        return linhas.map((linha) => this.paraEndereco(linha));
    }

    // RN06: sempre filtra pelo id_cliente, então um cliente nunca enxerga o endereço de outro
    async buscaEnderecoID(
        id_cliente: number,
        id_endereco: number
    ): Promise<EnderecoCliente | undefined> {
        const linhas = await executarComandoSQL<RowDataPacket[]>(
            `SELECT * FROM endereco_cliente
            WHERE id_endereco = ? AND id_cliente = ?`,
            [id_endereco, id_cliente]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        return this.paraEndereco(linhas[0]);
    }

    async atualizaEndereco(endereco: EnderecoCliente): Promise<boolean> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `UPDATE endereco_cliente
            SET cep = ?, cidade = ?, uf = ?, bairro = ?, logradouro = ?, numero = ?
            WHERE id_endereco = ? AND id_cliente = ?`,
            [
                endereco.cep,
                endereco.cidade,
                endereco.uf,
                endereco.bairro,
                endereco.logradouro,
                endereco.numero,
                endereco.id_endereco,
                endereco.id_cliente
            ]
        );

        return resultado.affectedRows > 0;
    }

    async removeEndereco(
        id_cliente: number,
        id_endereco: number
    ): Promise<boolean> {
        const resultado = await executarComandoSQL<ResultSetHeader>(
            `DELETE FROM endereco_cliente
            WHERE id_endereco = ? AND id_cliente = ?`,
            [id_endereco, id_cliente]
        );

        return resultado.affectedRows > 0;
    }
}