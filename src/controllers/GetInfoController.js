const database = require('../database')

module.exports = {
    async userInfo (request, response) {
        try {
            var info = await database.select().where({ id: request.userId }).table('users').first()
            return response.status(200).json(info)
        } catch (error) {
            return response.status(200).json({ ok: false })
        }
        
    },

    async variationInfo (request, response) {
        try {
            const sizes = await database.select().table('sizes')
            const colors = await database.select().table('colors')
        
            return response.status(200).json({ sizes, colors })  
        } catch (error) {
            return response.status(200).json({ ok: false })
        }
    }
}