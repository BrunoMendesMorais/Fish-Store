export class EnderecoCompra {
    constructor(
        public id_endereco_compra: number,
        public id_compra: number,
        public cep: string,
        public cidade: string,
        public uf: string,
        public bairro: string,
        public logradouro: string,
        public numero: string
    ) {}
}