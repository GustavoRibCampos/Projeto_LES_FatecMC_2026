const Cliente    = require('../Model/Cliente')
const ClienteDAO = require('../DAO/ClienteDAO')
const router     = require('express').Router()
const clientedao = new ClienteDAO()

// ── CLIENTES ──────────────────────────────────────────

router.get('/clientes', async (req, res) => {
  try {
    const resultado = await clientedao.lerClientes()
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await clientedao.lerClientePorID(id)
    if (!resultado) return res.status(404).json({ erro: 'Cliente não encontrado.' })
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.post('/clientes', async (req, res) => {
  try {
    const { nome, login, senha, cpf, telefone } = req.body
    const resultado = await clientedao.criarCliente(nome, login, senha, cpf, telefone)
    res.status(201).json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, login, cpf, telefone } = req.body
    const resultado = await clientedao.atualizarCliente(nome, login, cpf, telefone, id)
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.patch('/clientes/:id/senha', async (req, res) => {
  try {
    const { id } = req.params
    const { senhaAtual, novaSenha } = req.body
    const resultado = await clientedao.alterarSenha(id, senhaAtual, novaSenha)
    if (resultado.erro) return res.status(401).json(resultado)
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params
    await clientedao.deletarCliente(id)
    res.json({ sucesso: true })
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// ── LOGIN ─────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { login, senha } = req.body
    const cliente = await clientedao.buscarPorLogin(login)
    if (!cliente) return res.status(401).json({ erro: 'Usuário não encontrado.' })
    const bcrypt = require('bcrypt')
    const ok = await bcrypt.compare(senha, cliente.senha)
    if (!ok) return res.status(401).json({ erro: 'Senha incorreta.' })
    const { senha: _, ...clienteSemSenha } = cliente
    res.json(clienteSemSenha)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// ── ENDEREÇOS ─────────────────────────────────────────

router.get('/clientes/:id/enderecos', async (req, res) => {
  try {
    const resultado = await clientedao.listarEnderecos(req.params.id)
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.post('/clientes/:id/enderecos', async (req, res) => {
  try {
    const { id } = req.params
    const { label, logradouro, numero, bairro, cidade, estado, cep, referencia } = req.body
    const resultado = await clientedao.criarEndereco(id, label, logradouro, numero, bairro, cidade, estado, cep, referencia)
    res.status(201).json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.delete('/clientes/:clienteId/enderecos/:enderecoId', async (req, res) => {
  try {
    const { clienteId, enderecoId } = req.params
    await clientedao.deletarEndereco(enderecoId, clienteId)
    res.json({ sucesso: true })
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// ── CARTÕES ───────────────────────────────────────────

router.get('/clientes/:id/cartoes', async (req, res) => {
  try {
    const resultado = await clientedao.listarCartoes(req.params.id)
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.post('/clientes/:id/cartoes', async (req, res) => {
  try {
    const { id } = req.params
    const { label, numero, titular, validade, bandeira } = req.body
    const resultado = await clientedao.criarCartao(id, label, numero, titular, validade, bandeira)
    res.status(201).json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.patch('/clientes/:clienteId/cartoes/:cartaoId/preferencial', async (req, res) => {
  try {
    const { clienteId, cartaoId } = req.params
    const resultado = await clientedao.setPreferencial(cartaoId, clienteId)
    res.json(resultado)
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

router.delete('/clientes/:clienteId/cartoes/:cartaoId', async (req, res) => {
  try {
    const { clienteId, cartaoId } = req.params
    await clientedao.deletarCartao(cartaoId, clienteId)
    res.json({ sucesso: true })
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

module.exports = router