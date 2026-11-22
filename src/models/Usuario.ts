export class Usuario {
    constructor(
        public id_cliente: number,
        public email: string,
        public senha: string,
        public token: string,
        public nome: string,
        public telefone: string | null,
        public adm: boolean,
        public link_imagem: string | null
    ) {}
}