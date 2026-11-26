import { Categoria } from "../models/Categoria";
import { CategoriaRepository } from "../repositories/CategoriaRepository";

export class CategoriaService{

    private categoriaRepository: CategoriaRepository;

    constructor(){
        this.categoriaRepository = CategoriaRepository.getInstance();
    }

    
}