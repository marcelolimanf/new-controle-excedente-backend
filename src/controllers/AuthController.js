var SHA256 = require('crypto-js/sha256')
const jwt = require('jsonwebtoken')

const database = require('../database')

function generateToken(params = {} ) {
    return jwt.sign(params, process.env.JWT_SECRET, {
      expiresIn: 86400,
    })
}


module.exports = {
    async signin (request, response) {
        const { username, password } = request.body

        if(!username || !password)
        return response.status(404).json({ ok: false, message: 'Por favor, informe o nome de usuário e senha' })
    
        try {
          const user = await database('users').where({ username }).select().first()
    
          if(!user)
          return response.status(401).json({ ok: false, message: 'Nome de usuário ou senha incorreto.' })
    
          if(JSON.stringify(SHA256(password).words) !== user.password)
          return response.status(401).json({ ok: false, message: 'Nome de usuário ou senha incorreto.' })
    
          user.password = undefined
    
          return response.status(200).json({ ok: true, token: generateToken({ id: user.id, username: user.username }) })
        } catch (error) {
          console.log(error)
          return response.status(400).json({ ok: false, message: 'Ocorreu algum erro, contate o Evandro' })
        }
    },

    async signup (request, response) {
        const {
            username,
            password,
            isAdmin
          } = request.body
      
          if(!username || !password)
          return response.status(400).json({ ok: false, message: 'Por favor, preencha todos os dados!' })
      
          try {
            const user = await database('users').where({ username }).select().first()
      
            if(user)
            return response.status(302).json({ ok: false, message: 'Já existe um usuário cadastrado com esse nome de usuário!' })
      
            const hash = JSON.stringify(SHA256(password).words)
      
            await database.insert({
              username,
              password: hash,
              avatar: '/images/avatar.png',
              isAdmin,
            }).into('users')
              .then(result => response.status(200).json({ ok: true, message: 'Conta criada com sucesso' }))
              .catch(err => response.status(400).json({ ok: false, message: 'Ocorreu algum erro ao criar a conta, contate o Evandro' }))
          } catch (error) {
            return response.status(400).json({ ok: false, message: 'Ocorreu algum erro ao criar a conta, contate o Evandro' })
          }
    }
}