export class ItemCompra {
    constructor(
        public id_item: number,
        public id_compra: number,
        public id_produto: number,
        public quantidade: number,
        public preco_unidade: number,
        public desconto: number,
        public preco_total_produto: number
    ) {}
}