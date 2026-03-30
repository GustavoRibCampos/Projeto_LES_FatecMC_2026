const pool    = require('../db')
const bcrypt  = require('bcrypt')
const SALT    = 10

class ClienteDAO {

  async criarCliente(nome, login, senha, cpf, telefone) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const hash = await bcrypt.hash(senha, SALT)
      const sql  = `INSERT INTO cliente (nome, login, senha, cpf, telefone)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`
      const res  = await client.query(sql, [nome, login, hash, cpf, telefone])
      await client.query('COMMIT')
      return res.rows[0]
    } catch (erro) {
      await client.query('ROLLBACK')
      console.log(erro)
    } finally {
      client.release()
    }
  }

  async lerClientes() {
    try {
      const sql    = `SELECT id, nome, login, cpf, telefone FROM cliente`
      const result = await pool.query(sql)
      return result.rows
    } catch (erro) {
      console.log(erro)
    }
  }

  async lerClientePorID(id) {
    try {
      const sql    = `SELECT id, nome, login, cpf, telefone FROM cliente WHERE id = $1`
      const result = await pool.query(sql, [id])
      return result.rows[0]
    } catch (erro) {
      console.log(erro)
    }
  }

  async buscarPorLogin(login) {
    try {
      const sql    = `SELECT * FROM cliente WHERE login = $1`
      const result = await pool.query(sql, [login])
      return result.rows[0]
    } catch (erro) {
      console.log(erro)
    }
  }

  async atualizarCliente(nome, login, cpf, telefone, id) {
    try {
      const sql    = `UPDATE cliente SET nome=$1, login=$2, cpf=$3, telefone=$4 WHERE id=$5`
      const result = await pool.query(sql, [nome, login, cpf, telefone, id])
      return result.rows[0]
    } catch (erro) {
      console.log(erro)
    }
  }

  async alterarSenha(id, senhaAtual, novaSenha) {
    try {
      const res    = await pool.query(`SELECT senha FROM cliente WHERE id = $1`, [id])
      const cliente = res.rows[0]
      if (!cliente) return { erro: 'Cliente não encontrado.' }
      const ok = await bcrypt.compare(senhaAtual, cliente.senha)
      if (!ok) return { erro: 'Senha atual incorreta.' }
      const hash = await bcrypt.hash(novaSenha, SALT)
      await pool.query(`UPDATE cliente SET senha=$1 WHERE id=$2`, [hash, id])
      return { sucesso: true }
    } catch (erro) {
      console.log(erro)
    }
  }

  async deletarCliente(id) {
    try {
      const result = await pool.query(`DELETE FROM cliente WHERE id=$1`, [id])
      return result.rowCount
    } catch (erro) {
      console.log(erro)
    }
  }


  async criarEndereco(cliente_id, label, logradouro, numero, bairro, cidade, estado, cep, referencia) {
    try {
      const sql = `INSERT INTO endereco (cliente_id, label, logradouro, numero, bairro, cidade, estado, cep, referencia)
                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`
      const res = await pool.query(sql, [cliente_id, label, logradouro, numero, bairro, cidade, estado, cep, referencia])
      return res.rows[0]
    } catch (erro) {
      console.log(erro)
    }
  }

  async listarEnderecos(cliente_id) {
    try {
      const res = await pool.query(`SELECT * FROM endereco WHERE cliente_id=$1`, [cliente_id])
      return res.rows
    } catch (erro) {
      console.log(erro)
    }
  }

  async deletarEndereco(id, cliente_id) {
    try {
      const res = await pool.query(`DELETE FROM endereco WHERE id=$1 AND cliente_id=$2`, [id, cliente_id])
      return res.rowCount
    } catch (erro) {
      console.log(erro)
    }
  }


  async criarCartao(cliente_id, label, numero, titular, validade, bandeira) {
    try {
      const sql = `INSERT INTO cartao (cliente_id, label, numero, titular, validade, bandeira)
                   VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`
      const res = await pool.query(sql, [cliente_id, label, numero, titular, validade, bandeira])
      return res.rows[0]
    } catch (erro) {
      console.log(erro)
    }
  }

  async listarCartoes(cliente_id) {
    try {
      const res = await pool.query(`SELECT * FROM cartao WHERE cliente_id=$1`, [cliente_id])
      return res.rows
    } catch (erro) {
      console.log(erro)
    }
  }

  async setPreferencial(id, cliente_id) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(`UPDATE cartao SET preferencial=false WHERE cliente_id=$1`, [cliente_id])
      await client.query(`UPDATE cartao SET preferencial=true  WHERE id=$1 AND cliente_id=$2`, [id, cliente_id])
      await client.query('COMMIT')
      return { sucesso: true }
    } catch (erro) {
      await client.query('ROLLBACK')
      console.log(erro)
    } finally {
      client.release()
    }
  }

  async deletarCartao(id, cliente_id) {
    try {
      const res = await pool.query(`DELETE FROM cartao WHERE id=$1 AND cliente_id=$2`, [id, cliente_id])
      return res.rowCount
    } catch (erro) {
      console.log(erro)
    }
  }

}

module.exports = ClienteDAO