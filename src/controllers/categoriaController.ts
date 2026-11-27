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

    async buscarPorId(req: Request, res: Response): Promise<Response>{
        try{
            const id = Number(req.params.id);

            if(!Number.isInteger(id) || id <= 0){
                return res.status(400).json({
                    mensagem: 'ID da categoria inválido'
                });
            }

            const categoria = await this.categoriaService.buscarCategoriaPorId(id);

            return res.status(200).json(categoria);
        } catch (erro: unknown){
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao buscar categoria';
            
            const status = mensagem === "A categoria informada não foi encontrada"
                ? 404
                : 500;
            
            return res.status(status).json({mensagem});
        }
    }

    async atualizar (req: Request, res: Response): Promise<Response>{
        try{
            const id = Number(req.params.id);
            const {nome} = req.body;

            if(!Number.isInteger(id) || id <= 0){
                return res.status(400).json({
                    mensagem: 'ID da categoria inválido'
                });
            }

            if(typeof nome !== 'string' || !nome.trim()){
                return res.status(400).json({
                    mensagem: "O nome da categoria é obrigatório"
                });
            }

            await this.categoriaService.atualizarCategoria(id, nome.trim());

            return res.status(200).json({
                mensagem: 'Categoria atualizada com sucesso'
            });
        } catch (erro: unknown){
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro interno ao atualizar categoria';
            
            let status = 500;

            if(mensagem === 'Categoria não encontrada'){
                status = 404;
            } else if(
                mensagem === "Já existe uma categoria com esse nome"
            ) {
                status = 409;
            } else if(
                mensagem.includes('obrigatório') ||
                mensagem.includes('100')
            ){
                status = 400;
            }

            return res.status(status).json({mensagem});
        }
    }


}