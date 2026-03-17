const Cliente = require('../Model/Cliente')
const Endereco = require('../Model/Endereco')
const pool = require('../db')

class ClienteDAO{
    constructor()
    {
        
    }

async criarCliente(nome, login, senha, cpf, telefone, endereco){
    const cliente = await pool.connect()
    try {
        await cliente.query('BEGIN')
        const res_ende = await cliente.query(
        `INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, referencia)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`, [endereco.logradouro, endereco.numero, endereco.bairro, 
        endereco.cidade, endereco.estado, endereco.referencia])

        const res_clie = await cliente.query(
        `INSERT INTO cliente (nome, login, senha, cpf, telefone, endereco) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`, [nome, login, senha, cpf, telefone, res_ende.rows[0].id])
        
        await cliente.query('COMMIT')

        return res_clie.rows[0]

        
    } catch (erro){
        await cliente.query('ROLLBACK')
        console.log(erro)
    } finally {
        cliente.release()
    }

}

async lerCliente(){
    try{
        const sql =     `SELECT * FROM cliente`

        const result = await pool.query(sql)
        return result.rows
    } catch(erro) {
        console.log(erro)
    }
    
}

atualizarCliente(id){
    const sql = `UPDATE cliente
                 SET nome = $1, login = $2, senha = $3, cpf = $4, telefone = $5, endereco = $6`
}

deletarCliente(){

}
}

module.exports = ClienteDAO