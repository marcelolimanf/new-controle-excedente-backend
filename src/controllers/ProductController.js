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
        const { id, sku, name } = request.query

        if (!id || !sku || !name) {
            return response.status(400).json({ ok: false, message: 'ID, SKU e nome são obrigatórios.' })
        }

        try {
            const product = await database.select().table('products').where({ id }).first()
            
            if (!product) {
                return response.status(404).json({ ok: false, message: 'Produto não encontrado.' })
            }

            const existingSku = await database.select().table('products').where({ sku }).whereNot({ id }).first()
            if (existingSku) {
                return response.status(400).json({ ok: false, message: 'Já existe outro produto com este SKU.' })
            }

            await database('products')
                .where({ id })
                .update({ 
                    sku,
                    name 
                })

            return response.status(200).json({ 
                ok: true, 
                message: 'Produto atualizado com sucesso!' 
            })
        } catch (error) {
            return response.status(500).json({ 
                ok: false, 
                message: 'Ocorreu algum erro, contate o Evandro.' 
            })
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
    ,
        async searchProduct(request, response) {
            const { query } = request.query

            if (!query) {
                return response.status(400).json({ ok: false, message: 'Parâmetro de busca obrigatório.' })
            }

            try {
                const results = await database('products')
                    .where('name', 'like', `%${query}%`)
                    .orWhere('sku', 'like', `%${query}%`)
                return response.status(200).json({ ok: true, products: results })
            } catch (error) {
                return response.status(500).json({ ok: false, message: 'Ocorreu algum erro, contate o Evandro.' })
            }
        }
}