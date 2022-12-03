const express = require('express');
const { products, users } = require("../../database")
const productRouter = express.Router()

// productRouter.get('/', (req, res) => {
//   res.status(200).send('hello world from product')
// })



productRouter.get('/', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    const admin = users.find(user => user.userName === 'admin')
    const user = users.find(user => user.userName === req.body.userName && user.password === req.body.password)
     if (userName === null || userName === undefined) {
        res.status(404).json('unauthorized user')
    }     
    else if (userName === admin.userName && password === admin.password) {
        
        res.status(200).json({products})
    }
    
    else if (userName === user.userName){ // if user is not an admin
        let storeSummary = '';
        if (user){
        let i = 0;
        const productsSummary = products.map(function (product) {
            return storeSummary += `(${++i}) ${product.productName} remains ${product.productQty} @ $${product.pricePerUnit} per unit\n`
        })
        console.log(products)
        }
        res.status(200).send(storeSummary)

    }
    
})

productRouter.get('/:id', (req, res) => {
    const product = products.find(product => product.productId === req.params.id);
    if (product) {
        res.status(200).json({ product });
    }
    else res.status(404).send('unknown product')
})



productRouter.post('/', (req, res) => {
    const userName = req.body.userName.toLowerCase()
    const password = req.body.password.toLowerCase()
    const admin = users.find(user => user.userName === 'admin')
    if (userName === admin.userName && password === admin.password) {
        delete req.body.userName
        delete req.body.password
        const newProduct = req.body
        newProduct.productId = 'p' + (products.length + 1)
        products.push(newProduct)
        console.log(newProduct)
        res.status(200).json({ newProduct })
    }

    else res.send('unknown user')
})

productRouter.put('/:userId.:productId', (req, res) => {
    if ((req.params.userId) === 'u1') { //if user is an admin
        const product = products.find(product => product.productId === req.params.productId); // to get the product if it exists
        if (product) {
            const productIndex = products.findIndex(product => product.productId === req.params.productId);

            const updatedProduct = req.body
            updatedProduct.productId = product.productId
            updatedProduct.productQty = (product.productQty > 0) ? product.productQty + req.body.quantity : req.body.quantity
            delete req.body.quantity

            products.splice(productIndex, 1, updatedProduct)
            res.status(200).json({ 'updated product':updatedProduct }) 
        }
        else
        {const newProduct = req.body
        newProduct.productId = 'p' + (products.length + 1)
        newProduct.productQty = req.body.quantity
        delete req.body.quantity
        products.push(newProduct)
        console.log(newProduct)
        res.status(201).end(`new product created with ${newProduct.productId}`)}
    }
    else res.status(404).json('unauthorized user') // if user is not an admin
})

productRouter.patch('/:userId.:productId', (req, res) => {
    if ((req.params.userId) === 'u1') {
        const product = products.find(product => product.productId === req.params.productId);
        if (product) {
            for (value in req.body) {
                if (value === 'quantity') {
                    product.productQty = req.body.quantity
                }
                product[value] = req.body[value]
            }
            res.status(200).json({ 'update successful': product })
        }
        else res.status(404).send('product not found to update')
        console.error(`Error updating a product with id ${req.params.productId}. let backend check it`) // telling backend
    }
    else res.status(404).json('unauthorized user') // if user is not an admin    
})

productRouter.delete('/:userId.:productId', (req, res) => {
    if ((req.params.userId) === 'u1') {
        const productIndex = products.findIndex(product => product.productId === req.params.productId);
        if (productIndex >= 0) {
            products.splice(productIndex, 1)
            res.status(200).end('successfully delete')
        }
        else res.status(404).end('product not found')
    }
    else res.status(404).end('unauthorized user')

})

module.exports = productRouter