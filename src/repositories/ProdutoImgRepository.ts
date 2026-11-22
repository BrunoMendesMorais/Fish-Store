export class ProdutoImgRepository {
    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS produto_img (
            id_img_produto INT AUTO_INCREMENT PRIMARY KEY,
            id_produto INT NOT NULL,
            url_img VARCHAR(500) NOT NULL,
            capa BOOLEAN NOT NULL DEFAULT FALSE,

            CONSTRAINT fk_produto_img_produto
                FOREIGN KEY (id_produto)
                REFERENCES produto(id_produto)
        ) ENGINE=InnoDB;
        `;
    }
}
