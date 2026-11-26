import { promises } from "node:dns";
import { Categoria } from "../models/Categoria";
import { CategoriaRepository } from "../repositories/CategoriaRepository";

export class CategoriaService{

    private categoriaRepository: CategoriaRepository;

    constructor(){
        this.categoriaRepository = CategoriaRepository.getInstance();
    }

    async cadastrarCategoria(nome: string): Promise<Categoria | null>{
        nome = nome.trim();
        const limite = 100

        if(!nome){
            throw new Error("O nome da categoria é obrigatório");
        }

        if(nome.length > limite){
            throw new Error("O limite máximo de caracteres é 100");
        }

        if(await this.categoriaRepository.existeCategoriaPorNome(nome)){
            throw new Error("Já existe uma categoria com esse nome.");
        }

        const categoria = new Categoria(0, nome);

        return await this.categoriaRepository.cadastraCategoria(categoria);
    }

    async listarCategorias(): Promise<Categoria[]>{
        return await this.categoriaRepository.listaCategorias();
    }

    async buscarCategoriaPorId(id: number): Promise<Categoria | null>{
        const categoria = await this.categoriaRepository.listaCategoriaPorId(id);
        
        if(categoria === null){
            throw new Error("A categoria informada não foi encontrada");
        }
        return categoria;
    }


}