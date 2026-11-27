import { EnderecoCliente } from '../models/Endereco';
import { EnderecoClienteRepository } from '../repositories/EnderecoClienteRepository';

export class EnderecoService {
    enderecoRepository = EnderecoClienteRepository.getInstance();

    private validaId(valor: number, nome: string): void {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new Error(`${nome} deve ser um inteiro positivo valido.`, { cause: 400 });
        }
    }

    // Campo de texto obrigatório: não pode ser vazio, só espaços, nem passar do tamanho da coluna
    private validaTexto(valor: unknown, nome: string, tamanhoMaximo: number): string {
        if (typeof valor !== 'string' || valor.trim() === '') {
            throw new Error(`${nome} e obrigatorio.`, { cause: 400 });
        }
        if (valor.trim().length > tamanhoMaximo) {
            throw new Error(`${nome} deve ter no maximo ${tamanhoMaximo} caracteres.`, { cause: 400 });
        }
        return valor.trim();
    }

    // Valida o corpo da requisição e devolve os dados já limpos
    private validaDados(id_cliente: number, id_endereco: number, dados: any): EnderecoCliente {
        if (!dados || typeof dados !== 'object') {
            throw new Error('Dados do endereco nao informados.', { cause: 400 });
        }

        // CEP: "12345678" ou "12345-678" - tem que ser 8 dígitos
        if (typeof dados.cep !== 'string' || !/^\d{5}-?\d{3}$/.test(dados.cep.trim())) {
            throw new Error('cep deve ter 8 digitos (ex: 12345-678).', { cause: 400 });
        }
        const cep = dados.cep.trim().replace('-', '');

        // UF: 2 letras
        if (typeof dados.uf !== 'string' || !/^[A-Za-z]{2}$/.test(dados.uf.trim())) {
            throw new Error('uf deve ter 2 letras (ex: RJ).', { cause: 400 });
        }

        const uf = dados.uf.trim().toUpperCase();
        const cidade = this.validaTexto(dados.cidade, 'cidade', 100);
        const bairro = this.validaTexto(dados.bairro, 'bairro', 100);
        const logradouro = this.validaTexto(dados.logradouro, 'logradouro', 150);
        const numeroTexto = typeof dados.numero === 'number' ? String(dados.numero) : dados.numero;
        const numero = this.validaTexto(numeroTexto, 'numero', 20);

        return new EnderecoCliente(id_endereco, id_cliente, cep, cidade, uf, bairro, logradouro, numero);
    }

    async insereEndereco(id_cliente: number, dados: any): Promise<EnderecoCliente> {
        this.validaId(id_cliente, 'id_cliente');
        const endereco = this.validaDados(id_cliente, 0, dados);

        try {
            return await this.enderecoRepository.insereEndereco(endereco);
        } catch (erro: any) {
            // A chave estrangeira recusa um id_cliente que não existe na tabela usuario
            if (erro?.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('Cliente nao encontrado.', { cause: 404 });
            }
            throw erro;
        }
    }

    async listaEnderecos(id_cliente: number): Promise<EnderecoCliente[]> {
        this.validaId(id_cliente, 'id_cliente');
        return this.enderecoRepository.listaEnderecos(id_cliente);
    }

    async buscaEnderecoID(id_cliente: number, id_endereco: number): Promise<EnderecoCliente> {
        this.validaId(id_cliente, 'id_cliente');
        this.validaId(id_endereco, 'id_endereco');

        const endereco = await this.enderecoRepository.buscaEnderecoID(id_cliente, id_endereco);
        if (!endereco) {
            throw new Error('Endereco nao encontrado.', { cause: 404 });
        }
        return endereco;
    }

    async atualizaEndereco(id_cliente: number, id_endereco: number, dados: any): Promise<void> {
        this.validaId(id_cliente, 'id_cliente');
        this.validaId(id_endereco, 'id_endereco');
        const endereco = this.validaDados(id_cliente, id_endereco, dados);

        // RN27: só altera endereco_cliente; a cópia em endereco_compra fica intacta
        const atualizado = await this.enderecoRepository.atualizaEndereco(endereco);
        if (!atualizado) {
            throw new Error('Endereco nao encontrado.', { cause: 404 });
        }
    }

    async removeEndereco(id_cliente: number, id_endereco: number): Promise<void> {
        this.validaId(id_cliente, 'id_cliente');
        this.validaId(id_endereco, 'id_endereco');

        // RN27: endereco_compra não aponta para endereco_cliente, então os pedidos não são afetados
        const removido = await this.enderecoRepository.removeEndereco(id_cliente, id_endereco);
        if (!removido) {
            throw new Error('Endereco nao encontrado.', { cause: 404 });
        }
    }
}