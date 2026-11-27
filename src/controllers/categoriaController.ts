import { Request, Response } from "express";
import { CategoriaService } from "../services/categoriaService";

export class categoriaController{
    private categoriaService: CategoriaService;

    constructor(){
        this.categoriaService = new CategoriaService();
    }

    async cadastrar(req: Request, res: Response): Promise<Response>{
        try {
            const { nome } = req.body;

            if (
                typeof nome !== 'string' || !nome.trim()
        )      {
                return res.status(400).json({
                    mensagem: 'O nome da categoria é obrigatório.'
                });
        }

            const categoria = await this.categoriaService.cadastrarCategoria(
                nome.trim()
            );

            return res.status(201).json({
                mensagem: 'Categoria cadastrada com sucesso.',
                categoria
            });

        }   catch (erro: unknown) {
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao cadastrar categoria.';

            const status = mensagem === 'Já existe uma categoria com esse nome.'
                ? 409
                : mensagem.includes('100')
                    ? 400
                    : 500;

            return res.status(status).json({ mensagem });
        }
    }

    async listar(req: Request, res: Response): Promise<Response>{
        try{
            const categorias = await this.categoriaService.listarCategorias();

            return res.status(200).json(categorias);
        } catch (erro: unknown){
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao listar categorias';
            
            return res.status(500).json({mensagem});
        }
    }


}