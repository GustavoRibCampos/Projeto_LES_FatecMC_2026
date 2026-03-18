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
    const resultado = await req.params.id
    res.json(resultado)
})

router.post('/clientes/:id', async (req,res) => {
    const resultado = await clientedao.criarCliente()
    res.json(resultado)
})

router.put('/clientes/:id', async (req,res) => {
    const resultado = await clientedao.atualizarCliente()
    res.json(resultado)
})

router.delete('/clientes/:id', async (req, res) => {
    const resultado = await clientedao.deletarCliente()
    res.json(resultado)
})

router.post()

module.exports = router