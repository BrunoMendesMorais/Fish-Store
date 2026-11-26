import { promises } from "node:dns";
import { Categoria } from "../models/Categoria";
import { CategoriaRepository } from "../repositories/CategoriaRepository";
import { error } from "node:console";

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

    async atualizarCategoria(id: number, nome: string,): Promise<boolean>{
        const categoriaExistente = this.categoriaRepository.listaCategoriaPorId(id);

        if(!categoriaExistente){
            throw new Error("Categoria não encontrada");
        }

        nome = nome.trim();
        if(!nome){
            throw new Error("O nome da categoria é obrigatório");
        }

        if(nome.length > 100){
            throw new Error("O limite máximo de caracteres é 100");
        }

        if(await this.categoriaRepository.existeOutraCategoriaComNome(nome, id)){
            throw new Error("Já existe outra categoria com esse nome");
        }

        const categoria = new Categoria(id, nome);
        return await this.categoriaRepository.atualizarCategoria(categoria);
    }

    async excluirCategoria(id: number): Promise<boolean>{
        const categoria = await this.categoriaRepository.listaCategoriaPorId(id);
        if(!categoria){
            throw new Error("Categoria não encontrada");
        }

        const possuiProdutos = await this.categoriaRepository.possuiProdutosAssociados(id);

        if(possuiProdutos){
            throw new Error("Não é possível excluir uma categoria que possui produtos associados");
        }
        
        return await this.categoriaRepository.excluirCategoria(id)
    }



}