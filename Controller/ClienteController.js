const Cliente = require('../Model/Cliente')
const ClienteDAO = require ('../DAO/ClienteDAO')
const router = require('express').Router()

//Conexão para CRUD Cliente
router.get('/clientes', (req, res) => {
    res.send('ok')
})

module.exports = router