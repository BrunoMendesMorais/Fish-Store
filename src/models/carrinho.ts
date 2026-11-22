export class Carrinho {
    id_item: number;
    id_cliente: number;
    id_produto: number;
    quantidade: number;

    constructor(id_item: number, id_cliente: number, id_produto: number, quantidade: number) {
        this.id_item = id_item;
        this.id_cliente = id_cliente;
        this.id_produto = id_produto;
        this.quantidade = quantidade;
    }
}
