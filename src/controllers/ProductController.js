const database = require('../database')

module.exports = {
    async addProduct (request, response) {
        const { sku, product_name } = request.query

        database.select().table('products').where({ sku }).first()
        .then(result => {
        if(result)
        return response.status(200).json({ ok: false, message: 'Já existe um produto cadastrado com esse Sku.' })
        
        database.insert({ sku, name: product_name }).into('products')
        .then(include => {
            if(include)
            return response.status(200).json({ ok: true, message: 'Produto cadastrado com sucesso!' })
        })
        .catch(err => {
            return response.status(200).json({ ok: false, message: 'Ocorreu algum erro, contate o Evandro.' })
        })

        })
        .catch(err => {
        return response.status(200).json({ ok: false, message: 'Ocorreu algum erro, contate o Evandro.' })
        })
    },

    async editProduct (request, response) {
        var { quantity, page } = request.query

        if(!page){
            page = 1
        }
        
        if(quantity == 'all') {
            return database("products").paginate({
                perPage: 12,
                currentPage: page
              }).then(results => {
                response.status(200).json(results)
            })
        }else{
            return response.status(200).json({ ok: true })
        }
    
    },

    async getProducts (request, response) {
        const { quantity } = request.query
    
        if(quantity == 'all') {
            var data = await database.select().table('products')
            return response.status(200).json(data)
        }else{
            return response.status(200).json({ ok: true })
        }
    }
}