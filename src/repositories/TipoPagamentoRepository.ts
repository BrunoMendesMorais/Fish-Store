export class TipoPagamentoRepository {
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS tipo_pagamento (
            id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB;
        `;
    }
}