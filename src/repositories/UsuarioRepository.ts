export class UsuarioRepository {
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS usuario (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            nome VARCHAR(100) NOT NULL,
            telefone VARCHAR(20),
            adm BOOLEAN NOT NULL DEFAULT FALSE,
            link_imagem VARCHAR(500)
        ) ENGINE=InnoDB;
        `;
    }
}