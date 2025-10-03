const express = require('express')
const routes = express.Router()

const Auth = require('../middlewares')

const AuthController = require('../controllers/AuthController')
const BoxController = require('../controllers/BoxController')
const GetInfoController = require('../controllers/GetInfoController')
const ProductController = require('../controllers/ProductController')


//POST requests
routes.post('/auth/signup', AuthController.signup)
routes.post('/auth/signin', AuthController.signin)

routes.post('/edit/box', Auth, BoxController.editBox)
routes.post('/edit/variation', Auth, BoxController.editVariation)
routes.post('/add/box', Auth, BoxController.addBox)


//GET requests
routes.get('/get/boxs', Auth, BoxController.getBoxs)
routes.get('/get/products', Auth, ProductController.getProducts)
routes.get('/get/variations', Auth, GetInfoController.variationInfo)
routes.get('/get/user', Auth, GetInfoController.userInfo)

routes.get('/clear/box', Auth, BoxController.clearBox)
routes.get('/search/box', Auth, BoxController.searchBox)

routes.get('/add/product', Auth, ProductController.addProduct)
routes.get('/edit/product', Auth, ProductController.editProduct)
routes.get('/sesearchar/product', Auth, ProductController.searchProduct)

module.exports = routes