import { Categoria } from "../models/Categoria";


export class CategoriaRepository {
    private static instance: CategoriaRepository

    private constructor() {}

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS categoria (
            id_categoria INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
        ) ENGINE=InnoDB;
        `;
    }

    public static getInstance(): CategoriaRepository{
        if(!this.instance){
            this.instance =  new CategoriaRepository;
        }
        return this.instance;
    }
}
