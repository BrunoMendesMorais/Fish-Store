export class ProdutoRepository {
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
}
