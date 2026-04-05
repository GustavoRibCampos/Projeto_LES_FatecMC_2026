const pool = require('../db')

class PedidoDAO {

  async criarPedido(cliente_id, endereco_id, forma_pagamento, frete, modalidade_frete, desconto, total, itens, pagamentos) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const sqlPedido = `
        INSERT INTO pedido (cliente_id, endereco_id, forma_pagamento, frete, modalidade_frete, desconto, total, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'EM PROCESSAMENTO') RETURNING *`
      const resPedido = await client.query(sqlPedido, [
        cliente_id, endereco_id || null,
        forma_pagamento, frete, modalidade_frete, desconto, total
      ])
      const pedido = resPedido.rows[0]

      for (const item of itens) {
        await client.query(
          `INSERT INTO item_pedido (pedido_id, book_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)`,
          [pedido.id, item.bookId, item.qty, item.price]
        )
      }

      for (const pag of pagamentos) {
        await client.query(
          `INSERT INTO pedido_pagamento (pedido_id, cartao_id, forma, valor) VALUES ($1, $2, $3, $4)`,
          [pedido.id, pag.cartao_id || null, pag.forma, pag.valor]
        )
      }

      // Simula validação de pagamento → APROVADA (RN017)
      await client.query(`UPDATE pedido SET status = 'APROVADA' WHERE id = $1`, [pedido.id])
      pedido.status = 'APROVADA'

      await client.query('COMMIT')
      return pedido
    } catch (erro) {
      await client.query('ROLLBACK')
      console.log(erro)
      throw erro
    } finally {
      client.release()
    }
  }

  async listarPedidosPorCliente(cliente_id) {
    try {
      const resPedidos = await pool.query(`
        SELECT p.*, e.logradouro, e.numero, e.bairro, e.cidade, e.estado, e.cep
        FROM pedido p
        LEFT JOIN endereco e ON p.endereco_id = e.id
        WHERE p.cliente_id = $1
        ORDER BY p.data DESC, p.id DESC`, [cliente_id])
      const pedidos = resPedidos.rows

      for (const pedido of pedidos) {
        const resItens = await pool.query(`SELECT * FROM item_pedido WHERE pedido_id = $1`, [pedido.id])
        pedido.itens = resItens.rows
        const resPag = await pool.query(`
          SELECT pp.*, c.bandeira, c.numero AS cartao_numero, c.titular
          FROM pedido_pagamento pp LEFT JOIN cartao c ON pp.cartao_id = c.id
          WHERE pp.pedido_id = $1`, [pedido.id])
        pedido.pagamentos = resPag.rows
      }
      return pedidos
    } catch (erro) { console.log(erro); throw erro }
  }

  async listarTodosPedidos() {
    try {
      const res = await pool.query(`
        SELECT p.*, cl.nome AS cliente_nome, cl.login AS cliente_email
        FROM pedido p LEFT JOIN cliente cl ON p.cliente_id = cl.id
        ORDER BY p.data DESC, p.id DESC`)
      const pedidos = res.rows
      for (const pedido of pedidos) {
        const resItens = await pool.query(`SELECT * FROM item_pedido WHERE pedido_id = $1`, [pedido.id])
        pedido.itens = resItens.rows
        const resPag = await pool.query(`
          SELECT pp.*, c.bandeira, c.numero AS cartao_numero
          FROM pedido_pagamento pp LEFT JOIN cartao c ON pp.cartao_id = c.id
          WHERE pp.pedido_id = $1`, [pedido.id])
        pedido.pagamentos = resPag.rows
      }
      return pedidos
    } catch (erro) { console.log(erro); throw erro }
  }

  async buscarPedidoPorId(id) {
    try {
      const res = await pool.query(`SELECT * FROM pedido WHERE id = $1`, [id])
      const pedido = res.rows[0]
      if (!pedido) return null
      const resItens = await pool.query(`SELECT * FROM item_pedido WHERE pedido_id = $1`, [id])
      pedido.itens = resItens.rows
      const resPag = await pool.query(`SELECT * FROM pedido_pagamento WHERE pedido_id = $1`, [id])
      pedido.pagamentos = resPag.rows
      return pedido
    } catch (erro) { console.log(erro); throw erro }
  }

  async atualizarStatus(id, status) {
    try {
      const res = await pool.query(`UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *`, [status, id])
      return res.rows[0]
    } catch (erro) { console.log(erro); throw erro }
  }

}

module.exports = PedidoDAO