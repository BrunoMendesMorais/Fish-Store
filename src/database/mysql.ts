import mysql, { PoolConnection } from 'mysql2/promise';

import { CategoriaRepository } from '../repositories/CategoriaRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { TipoPagamentoRepository } from '../repositories/TipoPagamentoRepository';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { ProdutoImgRepository } from '../repositories/ProdutoImgRepository';
import { EnderecoClienteRepository } from '../repositories/EnderecoClienteRepository';
import { CompraRepository } from '../repositories/compraRepository';
import { ItemCompraRepository } from '../repositories/itemCompraRepository';
import { EnderecoCompraRepository } from '../repositories/EnderecoCompraRepository';

const dbConfig = {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'FISH_STORE',
    dateStrings: true
};

// Criação do pool de conexões
export const banco = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Método centralizado para executar SQL
export async function executarComandoSQL<T = any>(
    query: string,
    valores: any[] = [],
    conexao?: PoolConnection
): Promise<T> {
    try {
        const executor = conexao ?? banco;

        const [resultado] = await executor.execute(query, valores);

        return resultado as T;

    } catch (error) {
        console.error('Erro ao executar a query:', error);
        throw error;
    }
}

// Testa a conexão com o banco
export async function testarConexao(): Promise<void> {
    try {
        const connection = await banco.getConnection();

        console.log('Conexão bem-sucedida com o banco de dados MySQL');

        connection.release();

    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
}

// Inicializa as tabelas
export async function inicializarBanco(): Promise<void> {
    console.log('Sincronizando schemas do banco de dados...');

    const schemas = [
        CategoriaRepository.getCreateTableQuery(),
        UsuarioRepository.getCreateTableQuery(),
        TipoPagamentoRepository.getCreateTableQuery(),
        ProdutoRepository.getCreateTableQuery(),
        ProdutoImgRepository.getCreateTableQuery(),
        EnderecoClienteRepository.getCreateTableQuery(),
        CompraRepository.getCreateTableQuery(),
        ItemCompraRepository.getCreateTableQuery(),
        EnderecoCompraRepository.getCreateTableQuery()
    ];

    try {
        await testarConexao();

        for (const query of schemas) {
            await executarComandoSQL(query);
        }

        console.log('Todos os repositórios foram inicializados com sucesso.');

    } catch (err) {
        console.error(
            'Erro crítico na sincronização dos repositórios:',
            err
        );

        process.exit(1);
    }
}

// Encerra o pool
export async function fecharConexao(): Promise<void> {
    await banco.end();
    console.log('Pool de conexões encerrado.');
}

export default banco;
