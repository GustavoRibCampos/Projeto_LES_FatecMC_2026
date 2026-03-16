const Endereco = require('./Endereco')

class Cliente
{
    constructor()
    {
        this._nome = null
        this._senha = null
        this._cpf = null
        this._telefone = null
        this._endereco = null
    }

    //Getters
    get nome()
    {
        return this._nome
    }

    get senha()
    {
        return this._senha
    }

    get telefone()
    {
        return this._telefone
    }

    get cpf()
    {
        return this._cpf
    }

    get endereco()
    {
        return this._endereco
    }

    //Setters

    set cpf(cpf)
    {
        const str = cpf
        const array = str.split('')

        // verifica se possui . ou -
        for (let i = 0; i < array.length; i++) 
        {
        if (array[i].includes(".") || array[i].includes("-")) 
            {
                console.log(`CPF inválido: não pode conter "." ou "-"`)
                return
            }
        }

        if (array.length !== 11)
        {
            console.log("CPF inválido: precisa ter 11 dígitos")
            return
        }

        // evita sequências iguais
        if (/^(\d)\1+$/.test(str))
        {
            console.log("CPF inválido: sequência repetida")
            return
        }

        let soma = 0
        let resto

        // primeiro dígito verificador
        for (let i = 0; i < 9; i++) 
        {
            soma += parseInt(array[i]) * (10 - i)
        }

        resto = (soma * 10) % 11
        if (resto === 10) resto = 0

        if (resto !== parseInt(array[9]))
        {
            console.log("CPF inválido")
            return
        }

        soma = 0

        // segundo dígito verificador
        for (let i = 0; i < 10; i++) 
        {
            soma += parseInt(array[i]) * (11 - i)
        }

        resto = (soma * 10) % 11
        if (resto === 10) resto = 0

        if (resto !== parseInt(array[10]))
        {
            console.log("CPF inválido")
            return
        }

        // se passou por tudo
        this._cpf = cpf
    }

    set telefone(telefone)
    {
        const str = telefone.replace(/\D/g, '')

        if (str.length === 11) 
        {
            // celular com DDD
            this._telefone = `(${str.slice(0,2)}) ${str.slice(2,7)}-${str.slice(7)}`
        } 
        else if (str.length === 10) 
        {
            // telefone fixo com DDD
            this._telefone = `(${str.slice(0,2)}) ${str.slice(2,6)}-${str.slice(6)}`
        } 
        else 
        {
            console.log("Telefone inválido")
            this._telefone = telefone
        }
    }


    set senha(senha)
    {
        if (senha.length < 8)
        {
            console.log("Senha inválida: deve ter pelo menos 8 caracteres")
            return 
        }

        if (!/[A-Z]/.test(senha))
        {
            console.log("Senha inválida: precisa ter letra maiúscula")
            return 
        }

        if (!/[a-z]/.test(senha))
        {
            console.log("Senha inválida: precisa ter letra minúscula")
            return 
        }

        if (!/[!@#$%"&*()'£¢¹²³¬{}`ªº~^:;.,<>°/?/°®ŧ↓→→øþ'̉̉ħŋđðßæ«»©„“”µ]/.test(senha))
        {
            console.log("Senha inválida: precisa ter um símbolo")
            return 
        }

        this._senha = senha
    }
    
    set nome(nome)
    {
        this._nome = nome
    }

    set endereco(endereco)
    {
        if (endereco instanceof Endereco) {this._endereco = endereco}
        
        else 
        {
            console.log("Endereço inválido")
        }
    }
}
module.exports = Cliente