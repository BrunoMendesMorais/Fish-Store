export class Compra {
    id_compra: number;
    id_cliente: number;
    data: string;

    constructor(id_compra: number, id_cliente: number, data: string) {
        this.id_compra = id_compra;
        this.id_cliente = id_cliente;
        this.data = data;
    }
}
