import { Router } from 'express';
import { CarrinhoController } from '../controllers/carrinhoController';
import { CompraController } from '../controllers/compraController';
import { ItemCompraController } from '../controllers/itemCompraController';
import { EnderecoController } from '../controllers/enderecoController';

const router = Router();
const carrinhoController = new CarrinhoController();
const compraController = new CompraController();
const itemCompraController = new ItemCompraController();
const enderecoController = new EnderecoController();

// Carrinho
router.post('/clientes/:id_cliente/carrinho/itens', (req, res) => carrinhoController.insereItem(req, res));
router.get('/clientes/:id_cliente/carrinho/itens', (req, res) => carrinhoController.listaItens(req, res));
router.patch('/clientes/:id_cliente/carrinho/itens/:id_item', (req, res) => carrinhoController.atualizaQuantidade(req, res));
router.delete('/clientes/:id_cliente/carrinho/itens/:id_item', (req, res) => carrinhoController.removeItem(req, res));

// Compras
router.post('/clientes/:id_cliente/compras', (req, res) => compraController.finalizaCompra(req, res));
router.get('/clientes/:id_cliente/compras', (req, res) => compraController.listaCompras(req, res));
router.get('/clientes/:id_cliente/compras/:id_compra', (req, res) => compraController.listaCompraID(req, res));
router.get('/clientes/:id_cliente/compras/:id_compra/itens', (req, res) => itemCompraController.listaItens(req, res));

// Enderecos
router.post('/clientes/:id_cliente/enderecos', (req, res) => enderecoController.insereEndereco(req, res));
router.get('/clientes/:id_cliente/enderecos', (req, res) => enderecoController.listaEnderecos(req, res));
router.get('/clientes/:id_cliente/enderecos/:id_endereco', (req, res) => enderecoController.buscaEnderecoID(req, res));
router.put('/clientes/:id_cliente/enderecos/:id_endereco', (req, res) => enderecoController.atualizaEndereco(req, res));
router.delete('/clientes/:id_cliente/enderecos/:id_endereco', (req, res) => enderecoController.removeEndereco(req, res));

export default router;