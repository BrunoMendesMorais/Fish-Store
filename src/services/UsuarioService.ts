import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../models/Usuario';
import { ErrorApp } from '../models/Error';

class UsuarioService {
    private usuarioRepository: UsuarioRepository = UsuarioRepository.getInstance();

    private obterJwtSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('A variável de ambiente JWT_SECRET não foi configurada');
        }
        return secret;
    }

    private dadosPublicos(usuario: Usuario) {
        return {
            id_cliente: usuario.id_cliente,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            adm: usuario.adm,
            link_imagem: usuario.link_imagem
        };
    }

    async cadastrar(nome: string, email: string, senha: string, telefone?: string) {
        const usuarioExistente =
            await this.usuarioRepository.existeUsuarioPorEmail(email);
        if (usuarioExistente) {
            throw new Error('E-mail já cadastrado');
        }

        const senhaHash = await bcrypt.hash(senha, 12);
        const novoUsuario = new Usuario( 0, email, senhaHash, '',nome, telefone ?? null,false,null);

        const usuarioCadastrado =
            await this.usuarioRepository.cadastraUsuario(novoUsuario);

        if (!usuarioCadastrado) {
            throw new Error('Não foi possível cadastrar o usuário');
        }

        return this.dadosPublicos(usuarioCadastrado);
    }

    async login(email: string, senha: string) {
        const usuario = await this.usuarioRepository.listaUsuarioPorEmail(email);

        if (!usuario || !usuario.senha) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const tokenSalvo = await this.usuarioRepository.atualizarToken(
            usuario.id_cliente,
        );

        if (!tokenSalvo) {
            throw new ErrorApp(500, "Não foi possível iniciar a sessão");
        }
        
        const tokenSessao = jwt.sign(
            { id: usuario.id_cliente, token: tokenSalvo },
            this.obterJwtSecret(),
            { expiresIn: '15m' }
        );

        return {
            tokenSessao,
            usuario: this.dadosPublicos(usuario)
        };
    }

    async logout(idCliente: number) {
        const sessaoEncerrada =
            await this.usuarioRepository.encerrarSessao(idCliente);

        if (!sessaoEncerrada) {
            throw new ErrorApp(403,'Não foi possível encerrar a sessão');
        }
    }
}

export default new UsuarioService();