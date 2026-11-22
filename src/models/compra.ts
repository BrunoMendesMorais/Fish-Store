export class Compra {
    constructor(
        public id_compra: number,
        public id_cliente: number,
        public data: Date | string,
        public status: string,
        public valor_total: number,
        public sub_total: number,
        public valor_frete: number,
        public id_pagamento: number
    ) {}
}