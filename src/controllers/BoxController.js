const database = require('../database')
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
    async getBoxs (request, response) {
        var { quantity, number, page } = request.query

        if(!page){
            page = 1
        }
        
        if(quantity == 'all') {
            return database("boxs").orderBy(['number']).then(results => {
                response.status(200).json({ data: results })
            })
        }
        if(quantity == '12') {
            return database("boxs").orderBy(['number']).paginate({
                perPage: 12,
                currentPage: page
              }).then(results => {
                response.status(200).json(results)
            })
        }
        if(quantity == '1') {
            var data = await database.select().where({ number }).table('boxs').first()
            return response.status(200).json(data)
    
        }else{
            return response.status(200).json({ ok: true })
        }
    },

    async addBox (request, response)  {
        const { number, sku, product_name, total_quantity, variation } = request.body

        var checkBox = await database.select().where({ number }).table('boxs').first()

        if(!checkBox) {
            database.insert({
                number,
                sku, 
                product_name,
                total_quantity,
                variation: JSON.stringify(variation)
            }).into('boxs')
            .then(result => {
                return response.status(200).json({ title: 'Sucesso!', message: 'Caixa adicionada com sucesso!' })
            })
            .catch(err => {
                return response.status(200).json({ title: 'Erro!', message: 'Ocorreu algum erro ao adicionar essa caixa, contate o Evandro!' })
            })
        }else{
            return response.status(200).json({ title: 'Caixa já cadastrada!', message: 'Já existe uma caixa com esse número cadastrada.' })
        }
    },

    async clearBox (request, response) {
        const { id } = request.query

        database.update({
            sku: '', 
            product_name: '',
            total_quantity: '',
            variation:''
        })
        .where({ id })
        .table('boxs')
        .then(result => {
            return response.status(200).json({ title: 'Sucesso!', message: 'Caixa limpa com sucesso!' })
        })
        .catch(err => {
            return response.status(200).json({ title: 'Erro!', message: 'Ocorreu algum erro ao limpar essa caixa, contate o Evandro!' })
        })
    },

    async editBox (request, response) {
        const { number, sku, product_name, total_quantity, variation, edited_by } = request.body

        database.update({
            number,
            sku, 
            product_name,
            total_quantity,
            variation: JSON.stringify(variation),
            edited_by,
            edited_date: moment().format('LLL')
        })
        .where({ number })
        .table('boxs')
        .then(result => {
            return response.status(200).json({ title: 'Sucesso!', message: 'Caixa editada com sucesso!' })
        })
        .catch(err => {
            return response.status(200).json({ title: 'Erro!', message: 'Ocorreu algum erro ao editar essa caixa, contate o Evandro!' })
        })

    },

    async searchBox (request, response) {
        const { type, number, product_name, sku, color, size } = request.query

    
        if(type == 'number'){
            if(number != '' ){
                database.select().where({ number }).table('boxs').first()
                .then(data => {
                    return response.status(200).json(data)
                })
                .catch(err => {
                    return response.status(200).json({ ok: false })
                })
            }else{
                return response.status(200).json({ ok: false })
            }
        }
    
        if(type == 'product_name'){
            if(product_name != '' ){
                database.table('boxs')
                .select('')
                .where('product_name', 'like', `%${product_name}%`)
                .then(data => {
                    return response.status(200).json(data)
                })
                .catch(err => {
                    console.log(err)
                    return response.status(200).json({ ok: false })
                })
            }
        }
    
        if(type == 'variation'){
            database.table('boxs')
            .select('')
            .where('variation', 'like', `%${sku}%`)
            .then(data => {
                return response.status(200).json(data)
            })
            .catch(err => {
                console.log(err)
                return response.status(200).json({ ok: false })
            })
        }
    },

    async editVariation (request, response) {
        const { variation_color, variation_size } = request.body

        await database('colors').del()
        await database('sizes').del()

        try {
            await database.insert(variation_color).into('colors')
            await database.insert(variation_size).into('sizes')

            return response.status(200).json({ ok: true, message: 'Variações alteradas com sucesso!' })
        } catch (error) {
            console.log(error)
            return response.status(200).json({ ok: false, message: 'Ocorreu algum erro, contate o Evandro.' })
        
        }
    }
}
