const PedidoDAO = require('../DAO/PedidoDAO')
const router    = require('express').Router()
const pedidodao = new PedidoDAO()

// Listar todos os pedidos (admin)
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await pedidodao.listarTodosPedidos()
    res.json(pedidos)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// Listar pedidos de um cliente
router.get('/clientes/:id/pedidos', async (req, res) => {
  try {
    const pedidos = await pedidodao.listarPedidosPorCliente(req.params.id)
    res.json(pedidos)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// Criar pedido
router.post('/pedidos', async (req, res) => {
  try {
    const {
      cliente_id, endereco_id, cartao_id,
      forma_pagamento, frete, modalidade_frete,
      desconto, total, itens
    } = req.body

    if (!cliente_id || !itens || !itens.length) {
      return res.status(400).json({ erro: 'Dados insuficientes para criar o pedido.' })
    }

    const pedido = await pedidodao.criarPedido(
      cliente_id, endereco_id, cartao_id,
      forma_pagamento, frete, modalidade_frete,
      desconto, total, itens
    )
    res.status(201).json(pedido)
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao criar pedido.' })
  }
})

// Atualizar status do pedido (admin)
router.patch('/pedidos/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const statusValidos = [
      'EM PROCESSAMENTO', 'APROVADA', 'REPROVADA',
      'EM TRÂNSITO', 'ENTREGUE',
      'DEFEITO SOLICITADO', 'DEFEITO APROVADO', 'DEFEITO REJEITADO',
      'ITEM RECEBIDO', 'REENVIO EM TRÂNSITO', 'REENVIO ENTREGUE'
    ]
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ erro: 'Status inválido.' })
    }
    const pedido = await pedidodao.atualizarStatus(req.params.id, status)
    res.json(pedido)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

module.exports = router