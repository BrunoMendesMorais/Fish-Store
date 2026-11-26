import { Router } from 'express';
import { CarrinhoController } from '../controllers/carrinhoController';
import { CompraController } from '../controllers/compraController';
import { ItemCompraController } from '../controllers/itemCompraController';
import { usuarioController } from '../controllers/UsuarioContoller';

const router = Router();
const carrinhoController = new CarrinhoController();
const compraController = new CompraController();
const itemCompraController = new ItemCompraController();

// Carrinho

router.get('/api/carrinho', (req, res) => carrinhoController.listaItens(req, res));
router.post('/api/carrinho/itens', (req, res) => carrinhoController.insereItem(req, res));
router.patch('/api/carrinho/itens/:id_item', (req, res) => carrinhoController.atualizaQuantidade(req, res));
router.delete('/api/carrinho/itens/:id_item', (req, res) => carrinhoController.removeItem(req, res));
//router.delete('/api/carrinho/itens', (req, res) => carrinhoController.removeAllItens(req, res));

// Compras

// router.post('/api/compras', (req, res) => compraController.finalizaCompra(req, res));
router.get('/api/compras', (req, res) => compraController.listaCompras(req, res));
router.get('/api/compras/:id_compra', (req, res) => compraController.listaCompraID(req, res));
router.patch('/api/compras/:id_compra/cancelamento', (req, res) => compraController.cancelarCompra(req, res));
router.patch('/api/compras/:id_compra/status', (req,res) => compraController.atualizaStatus(req,res));

// Usuario
router.post('/clientes', (req, res) => usuarioController.cadastrar(req, res));
router.post('/clientes/login', (req, res) => usuarioController.login(req, res));

export default router;