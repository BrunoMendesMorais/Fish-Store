import { Router } from 'express';
import { CarrinhoController } from '../controllers/carrinhoController';
import { CompraController } from '../controllers/compraController';
import { ItemCompraController } from '../controllers/itemCompraController';
import { usuarioController } from '../controllers/UsuarioContoller';
import { autenticar } from '../services/AutenticacaoService';

const router = Router();
const carrinhoController = new CarrinhoController();
const compraController = new CompraController();
const itemCompraController = new ItemCompraController();

// Carrinho
router.post('/clientes/:id_cliente/carrinho/itens', (req, res) => carrinhoController.insereItem(req, res));
router.get('/clientes/:id_cliente/carrinho/itens', (req, res) => carrinhoController.listaItens(req, res));
router.patch('/clientes/:id_cliente/carrinho/itens/:id_item', (req, res) => carrinhoController.atualizaQuantidade(req, res));
router.delete('/clientes/:id_cliente/carrinho/itens/:id_item', (req, res) => carrinhoController.removeItem(req, res));

// Compras
// router.post('/clientes/:id_cliente/compras', (req, res) => compraController.finalizaCompra(req, res));
router.get('/clientes/:id_cliente/compras', (req, res) => compraController.listaCompras(req, res));
router.get('/clientes/:id_cliente/compras/:id_compra', (req, res) => compraController.listaCompraID(req, res));
router.get('/clientes/:id_cliente/compras/:id_compra/itens', (req, res) => itemCompraController.listaItens(req, res));

//Usuario autenticacao
router.post('/login', (req, res) => usuarioController.login(req, res));
router.post('/logout', (req, res) => usuarioController.logout(req, res));

// Usuario
router.post('/usuario', (req, res) => usuarioController.cadastrar(req, res));
router.get('/usuario', (req, res) => usuarioController.listar(req, res));
router.patch('/usuario/imagem',autenticar,(req, res)=> usuarioController.atualizaImagem(req, res));
router.put('/usuario',autenticar, (req, res) => usuarioController.atualizar(req, res));

export default router;