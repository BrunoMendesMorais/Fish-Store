import { ProdutoRepository } from "../repositories/ProdutoRepository";
import { ProdutoImgRepository } from "../repositories/ProdutoImgRepository";
import { Produto } from './../models/Produto';
import { ProdutoImg } from "../models/ProdutoImg";

class ProdutoService{
    private produtoRepository: ProdutoRepository = ProdutoRepository.getInstance()
    private produtoImgRepository: ProdutoImgRepository = ProdutoImgRepository.getInstance()

    async listarProdutos(){
        return await this.produtoRepository.listaProduto()
    }

    async listarProdutoPorId(id: number) {
        const produto = await this.produtoRepository.listaProdutoPorId(id)

        if (!produto) {
            throw new Error("Produto não encontrado")
        }

        const imagens = await this.produtoImgRepository.listaImagensPorProduto(id)

        return { ...produto, imagens }
    }

    async listarProdutosPorCategoria(id_categoria: number){
        return await this.produtoRepository.listaProdutoPorCategoria(id_categoria)
    }

    async cadastrar(
        nome: string,
        preco_unidade: number,
        preco_final_unidade: number,
        id_categoria: number,
        estoque: number,
        desconto: number = 0,
        descricao?: string,
        status: string = "ativo"
    ){
        const novoProduto = new Produto(
            0,
            nome,
            descricao ?? null,
            preco_unidade,
            preco_final_unidade,
            desconto,
            id_categoria,
            estoque,
            status
        )

        const produtoCadastrado = await this.produtoRepository.cadastrarProduto(novoProduto)

        if (!produtoCadastrado) {
            throw new Error("Não foi possível cadastrar o produto")
        }

        return produtoCadastrado
    }

    async atualizar(
        id: number,
        nome: string,
        preco_unidade: number,
        preco_final_unidade: number,
        id_categoria: number,
        estoque: number,
        desconto: number = 0,
        descricao?: string,
        status: string = "ativo"
    ){
        const produtoExistente = await this.produtoRepository.listaProdutoPorId(id)

        if (!produtoExistente) {
            throw new Error("Produto não encontrado")
        }

        const produtoAtualizado = new Produto(
            id,
            nome,
            descricao ?? null,
            preco_unidade,
            preco_final_unidade,
            desconto,
            id_categoria,
            estoque,
            status
        ) 

        const sucesso = await this.produtoRepository.atualizarProduto(produtoAtualizado)

        if (!sucesso) {
            throw new Error("Não foi possível atualizar o produto")
        }

        return produtoAtualizado
    }

    async deletar(id: number){
        const produtoExistente = await this.produtoRepository.listaProdutoPorId(id)

        if (!produtoExistente) {
            throw new Error("Produto não encontrado")
        }

        await this.produtoImgRepository.deletarImagensPorProduto(id)

        const sucesso = await this.produtoRepository.deletarProduto(id)

        if (!sucesso) {
            throw new Error("Não foi possível deletar o produto")
        }

        return { mensagem: "Produto deletado com sucesso" }
    }
}