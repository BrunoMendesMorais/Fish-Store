export class EnderecoClienteRepository {
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
}