export class ItemCompra {
    id_item: number;
    id_compra: number;
    id_produto: number;
    quantidade: number;

    constructor(id_item: number, id_compra: number, id_produto: number, quantidade: number) {
        this.id_item = id_item;
        this.id_compra = id_compra;
        this.id_produto = id_produto;
        this.quantidade = quantidade;
    }
}
