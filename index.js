const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')

const routes = require('./src/routes')

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(cors())
app.use(helmet())
app.use(routes)

app.listen(process.env.PORT || 3333, () => {
    console.log('Server started')
})