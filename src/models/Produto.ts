export class Produto {
    constructor(
        public id_produto: number,
        public nome: string,
        public descricao: string | null,
        public preco_unidade: number,
        public preco_final_unidade: number,
        public desconto: number,
        public id_categoria: number,
        public estoque: number,
        public status: string
    ) {}
}