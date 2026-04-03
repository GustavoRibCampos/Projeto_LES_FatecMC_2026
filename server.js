const ClienteController = require('./Controller/ClienteController')
const PedidoController  = require('./Controller/PedidoController')
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
    res.send('Servidor Express inicializado com sucesso!')
})

app.use('/', ClienteController)
app.use('/', PedidoController)

app.listen(port, () => 
{
    console.log('Servidor rodando em http://localhost:`${port}`')
})