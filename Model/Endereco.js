class Endereco
{
    constructor()
    {
        this._logradouro = null
        this._cep = null
        this._estado = null
        this._cidade = null
        this._referencia = null
        this._numero = null
        this._bairro = null
    }

    // Getters
    get logradouro()
    {
        return this._logradouro
    }

    get cep()
    {
        return this._cep
    }

    get estado()
    {
        return this._estado
    }

    get cidade()
    {
        return this._cidade
    }

    get referencia()
    {
        return this._referencia
    }

    get numero()
    {
        return this._numero
    }

    get bairro()
    {
        return this._bairro
    }

    // Setters
    set logradouro(logradouro)
    {
        this._logradouro = logradouro
    }

    set cep(cep)
    {
        const str = cep.replace(/\D/g, '')

        if (str.length !== 8)
        {
            console.log("CEP inválido: deve conter 8 dígitos")
            return
        }

        this._cep = `${str.slice(0,5)}-${str.slice(5)}`
    }

    set estado(estado)
    {
        this._estado = estado
    }

    set cidade(cidade)
    {
        this._cidade = cidade
    }

    set referencia(referencia)
    {
        this._referencia = referencia
    }

    set numero(numero)
    {
        this._numero = numero
    }

    set bairro(bairro)
    {
        this._bairro = bairro
    }
}

module.exports = Endereco