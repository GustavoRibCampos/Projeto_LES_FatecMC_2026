const pool = require('../db')

class PedidoDAO {

  async criarPedido(cliente_id, endereco_id, cartao_id, forma_pagamento, frete, modalidade_frete, desconto, total, itens) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const sqlPedido = `
        INSERT INTO pedido (cliente_id, endereco_id, cartao_id, forma_pagamento, frete, modalidade_frete, desconto, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
      const resPedido = await client.query(sqlPedido, [
        cliente_id, endereco_id || null, cartao_id || null,
        forma_pagamento, frete, modalidade_frete, desconto, total
      ])
      const pedido = resPedido.rows[0]

      for (const item of itens) {
        const sqlItem = `
          INSERT INTO item_pedido (pedido_id, book_id, quantidade, preco_unitario)
          VALUES ($1, $2, $3, $4)`
        await client.query(sqlItem, [pedido.id, item.bookId, item.qty, item.price])
      }

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
      const sqlPedidos = `
        SELECT p.*, 
               e.logradouro, e.numero, e.bairro, e.cidade, e.estado, e.cep,
               c.bandeira, c.numero AS cartao_numero, c.titular
        FROM pedido p
        LEFT JOIN endereco e ON p.endereco_id = e.id
        LEFT JOIN cartao c ON p.cartao_id = c.id
        WHERE p.cliente_id = $1
        ORDER BY p.data DESC, p.id DESC`
      const resPedidos = await pool.query(sqlPedidos, [cliente_id])
      const pedidos = resPedidos.rows

      for (const pedido of pedidos) {
        const sqlItens = `SELECT * FROM item_pedido WHERE pedido_id = $1`
        const resItens = await pool.query(sqlItens, [pedido.id])
        pedido.itens = resItens.rows
      }

      return pedidos
    } catch (erro) {
      console.log(erro)
      throw erro
    }
  }

  async listarTodosPedidos() {
    try {
      const sql = `
        SELECT p.*, cl.nome AS cliente_nome, cl.login AS cliente_email
        FROM pedido p
        LEFT JOIN cliente cl ON p.cliente_id = cl.id
        ORDER BY p.data DESC, p.id DESC`
      const res = await pool.query(sql)
      const pedidos = res.rows

      for (const pedido of pedidos) {
        const sqlItens = `SELECT * FROM item_pedido WHERE pedido_id = $1`
        const resItens = await pool.query(sqlItens, [pedido.id])
        pedido.itens = resItens.rows
      }

      return pedidos
    } catch (erro) {
      console.log(erro)
      throw erro
    }
  }

  async buscarPedidoPorId(id) {
    try {
      const sql = `SELECT * FROM pedido WHERE id = $1`
      const res = await pool.query(sql, [id])
      const pedido = res.rows[0]
      if (!pedido) return null

      const sqlItens = `SELECT * FROM item_pedido WHERE pedido_id = $1`
      const resItens = await pool.query(sqlItens, [id])
      pedido.itens = resItens.rows

      return pedido
    } catch (erro) {
      console.log(erro)
      throw erro
    }
  }

  async atualizarStatus(id, status) {
    try {
      const sql = `UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *`
      const res = await pool.query(sql, [status, id])
      return res.rows[0]
    } catch (erro) {
      console.log(erro)
      throw erro
    }
  }

}

module.exports = PedidoDAO