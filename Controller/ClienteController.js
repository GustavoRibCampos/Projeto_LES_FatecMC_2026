const Cliente = require('../Model/Cliente')
const ClienteDAO = require ('../DAO/ClienteDAO')
const router = require('express').Router()
const clientedao = new ClienteDAO()

//Conexão para CRUD Cliente
router.get('/clientes', async (req, res) => {
    const resultado = await clientedao.lerCliente()
    res.json(resultado)
})

router.get('/clientes/:id', async (req, res) => {
    const {id} = req.params
    const resultado = await clientedao.lerClientePorID(id)
    res.json(resultado)
})

router.post('/clientes', async (req,res) => {
    const{nome, login, senha, cpf, telefone, endereco} = req.body
    const resultado = await clientedao.criarCliente(nome, login, senha, cpf, telefone, endereco)
    res.json(resultado)
})

router.put('/clientes/:id', async (req,res) => {
    const {id} = req.params
    const {nome, login, cpf, telefone, endereco} = req.body
    const resultado = await clientedao.atualizarCliente(nome, login, cpf, telefone, endereco, id)
    res.json(resultado)
})

router.delete('/clientes/:id', async (req, res) => {
    const{id}= req.params
    const resultado = await clientedao.deletarCliente(id)
    res.json(resultado)
})

router.post('/login', async (req, res) => {
    const { login, senha } = req.body
    console.log('login recebido:', login)
    console.log('senha recebida:', senha)
    try {

        const cliente = await clientedao.buscarPorLogin(login)
        console.log('cliente encontrado:', cliente)
        if (!cliente) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' })
        }
        if (cliente.senha !== senha) {
            return res.status(401).json({ erro: 'Senha incorreta.' })
        }
        res.json(cliente)
    } catch (e) {
        res.status(500).json({ erro: 'Erro no servidor.' })
    }
})

module.exports = router