export class EnderecoCliente {
    constructor(
        public id_endereco: number,
        public id_cliente: number,
        public cep: string,
        public cidade: string,
        public uf: string,
        public bairro: string,
        public logradouro: string,
        public numero: string
    ) {}
}