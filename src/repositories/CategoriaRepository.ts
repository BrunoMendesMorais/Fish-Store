export class CategoriaRepository {
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS categoria (
            id_categoria INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
        ) ENGINE=InnoDB;
        `;
    }
}
