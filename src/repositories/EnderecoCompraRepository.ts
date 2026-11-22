export class EnderecoCompraRepository {
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS endereco_compra (
            id_endereco_compra INT AUTO_INCREMENT PRIMARY KEY,
            id_compra INT NOT NULL UNIQUE,
            cep VARCHAR(9) NOT NULL,
            cidade VARCHAR(100) NOT NULL,
            uf CHAR(2) NOT NULL,
            bairro VARCHAR(100) NOT NULL,
            logradouro VARCHAR(150) NOT NULL,
            numero VARCHAR(20) NOT NULL,

            CONSTRAINT fk_endereco_compra_compra
                FOREIGN KEY (id_compra)
                REFERENCES compra(id_compra)
        ) ENGINE=InnoDB;
        `;
    }
}