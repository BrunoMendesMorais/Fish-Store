import mysql, { PoolConnection } from 'mysql2/promise';
import { CarrinhoRepository } from '../repositories/carrinhoRepository'

export const dbConfig  = mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'FISH_STORE',
    dateStrings: true
});

const pool = mysql.createPool({...dbConfig, waitForConnections: true, connectionLimit: 10, queueLimit: 0});

export async function executarComandoSQL<T = any>( query: string, valores: any[] = [], conexao?: PoolConnection): Promise<T> {
    try {
        const executor = conexao ?? dbConfig;

        const [resultado] = await executor.execute(query, valores);

        return resultado as T;

    } catch (error) {
        console.error('Erro ao executar a query:', error);
        throw error;
    }
}

export async function testarConexao(): Promise<void> {
    try {
        const connection = await pool.getConnection();

        console.log('Conexão bem-sucedida com o banco de dados MySQL');

        connection.release();
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
}

export async function inicializarBanco(): Promise<void> {
    console.log('Sincronizando schemas do banco de dados...');

    const schemas = [
         CarrinhoRepository.getCreateTableQuery(),
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

export default pool;