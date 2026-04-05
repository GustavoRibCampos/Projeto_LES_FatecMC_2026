const PedidoDAO = require('../DAO/PedidoDAO')
const router    = require('express').Router()
const pedidodao = new PedidoDAO()

router.get('/pedidos', async (req, res) => {
  try {
    res.json(await pedidodao.listarTodosPedidos())
  } catch (e) { res.status(500).json({ erro: 'Erro interno.' }) }
})

router.get('/clientes/:id/pedidos', async (req, res) => {
  try {
    res.json(await pedidodao.listarPedidosPorCliente(req.params.id))
  } catch (e) { res.status(500).json({ erro: 'Erro interno.' }) }
})

router.post('/pedidos', async (req, res) => {
  try {
    const { cliente_id, endereco_id, forma_pagamento, frete, modalidade_frete, desconto, total, itens, pagamentos } = req.body
    if (!cliente_id || !itens?.length || !pagamentos?.length) {
      return res.status(400).json({ erro: 'Dados insuficientes.' })
    }

    // Valida RN014: valor mínimo R$10 por cartão
    for (const pag of pagamentos) {
      if (pag.forma === 'card' && pag.valor < 10) {
        return res.status(400).json({ erro: `Valor mínimo por cartão é R$ 10,00.` })
      }
    }

    const pedido = await pedidodao.criarPedido(
      cliente_id, endereco_id, forma_pagamento,
      frete, modalidade_frete, desconto, total, itens, pagamentos
    )
    res.status(201).json(pedido)
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao criar pedido.' })
  }
})

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
    res.json(await pedidodao.atualizarStatus(req.params.id, status))
  } catch (e) { res.status(500).json({ erro: 'Erro interno.' }) }
})

module.exports = router