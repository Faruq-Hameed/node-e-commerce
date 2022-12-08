const express = require('express');
const { products, users } = require("../../database")
const productRouter = express.Router()
const { getItem, getItemIndex } = require('../../modules')

// productRouter.get('/', (req, res) => {
//   res.status(200).send('hello world from product')
// })



productRouter.get('/', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const admin = users.find(user => user.userName === 'admin')
    const user = users.find(user => user.userName === req.body.userName && user.password === req.body.password)
    if (!userName || !password) return res.status(401).send('unauthorized user, provide a valid user name and password')
    if (userName === admin.userName && password === admin.password) return res.status(200).json({ products })

    if (userName === user.userName) { // if user is not an admin but userName is known
        let storeSummary = '';
        if (user) {
            let i = 0;
            const productsSummary = products.map(function (product) {
                return storeSummary += `(${++i}) ${product.productName} remains ${product.productQty} @ $${product.pricePerUnit} per unit\n`
            })
        }
        res.status(200).send(storeSummary)
    }
})

productRouter.get('/:id', (req, res) => {
    const product = getItem(products, "productId", req.params.id)
    if (product) {
        res.status(200).json({ product });
    }
    else res.status(404).send('unknown product')
})



productRouter.post('/', (req, res) => {
    const userName = req.body.userName.toLowerCase()
    const password = req.body.password.toLowerCase()
    const admin = getItem(users, "userName", 'admin')
    if (userName !== admin.userName && password !== admin.password) return res.status(401).send('unauthorized')
    
        delete req.body.userName
        delete req.body.password
        const newProduct = req.body
        newProduct.productId = 'p' + (products.length + 1)
        products.push(newProduct)
        console.log(newProduct)
        res.status(200).json({ newProduct })

})

productRouter.put('/:userId/:productId', (req, res) => {
    if (req.params.userId !== 'u1') res.status(401).json('unauthorized user') // if user is not an admin

        const product = getItem(products, "productId", req.params.productId) // to get the product if it exists
        if (product) {
            const productIndex = getItemIndex(products, "productId", req.params.productId);

            const updatedProduct = req.body
            updatedProduct.productId = product.productId
            updatedProduct.productQty = (product.productQty > 0) ? product.productQty + req.body.quantity : req.body.quantity
            delete req.body.quantity

            products.splice(productIndex, 1, updatedProduct)
            res.status(200).json({ 'updated product': updatedProduct })
        }
        else { // if the product doesn't exist
            const newProduct = req.body
            newProduct.productId = 'p' + (products.length + 1)
            newProduct.productQty = req.body.quantity
            delete req.body.quantity
            products.push(newProduct)
            res.status(201).end(`new product created with ${newProduct.productId}`)
        }
})

productRouter.patch('/:userId.:productId', (req, res) => {
    if (!req.body.quantity) return res.status(404).send('no input found to update');
    if (req.params.userId !== 'u1') return res.status(401).json('unauthorized user') // if user is not an admin   

    const product = getItem(products, "productId", req.params.productId)

    if (!product) return res.status(404).send('product not found to update') //if productId doesn't exist

    for (value in req.body) {
        if (value === 'quantity') {
            product.productQty = req.body.quantity
        }
        product[value] = req.body[value]
    }
    res.status(200).json({ 'update successful': product })
})

productRouter.delete('/:userId/:productId', (req, res) => {
    if (req.params.userId !== 'u1') return res.status(401).end('unauthorized user')
    const productIndex = getItemIndex(products, "productId", req.params.productId)

    if (productIndex < 0) return res.status(404).end('product not found')

    products.splice(productIndex, 1)
    res.status(200).end('successfully delete')
})

module.exports = productRouter