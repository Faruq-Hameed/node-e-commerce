const express = require('express')
const { products, users, allUsersOrders } = require("../database")

const orderRouter = express.Router()

orderRouter.get('/:userId', (req, res)=>{
    const user = users.find(user => user.userId === req.params.userId)
    if (!user) res.status(404).send('unknown user')

    if(req.params.userId === 'u1') res.status(200).json({allUsersOrders});

    if (user && req.params.userId !== 'u1') {
        const userOrder = allUsersOrders.find(user => user.userId === req.params.userId)

        if(!userOrder) res.status(200).send('your cart is empty')

        else {
            let orderSummary = 'below is your cart summary: \n \n'
            let i = 0
            userOrder.userOrders
                .map(function (order) {
                    orderSummary += `${++i}). orderId: ${order.orderId} ; productId ${order.productId} ; quantity: kg${order.totalQty};
        with value: $${order.orderValue} `
                })
                res.status(200).send(orderSummary)    
        }
        
    }
    
})


orderRouter.put('/',(req, res)=>{
    const currentUserOrder = allUsersOrders.find(user => user.userId === req.query.userId) 
    const product = products.find(products => products.productId === req.query.qty)
    if (!currentUserOrder) res.status(404).send('kindly sign in or register to make an order')
    if (!product) res.status(404).send('order out of stock or not found')
    else if (!req.query.qty) res.status(404).send('provide a valid quantity')

    else {
        const newOrder = {} //initiating an empty order object
        newOrder.orderId = req.query.userId + 'Or' + (currentUserOrder.userOrders.length + 1)
        newOrder.productId = req.query.productId
        newOrder.orderQty = parseInt(req.query.qty)
        newOrder.orderValue = parseInt(req.query.qty) * parseInt(product.pricePerUnit)

        currentUserOrder.userOrders.push(newOrder) //adding the new order to the user Order in the database
        product.productQty = product.productQty - newOrder.orderQty // subtracting the product from the database
        product.soldQty = product.soldQty + newOrder.orderQty //updating the product sold in the database
        res.status(200).send({newOrder: newOrder})
    }


})

orderRouter.post('/:userId/:productId',(req, res)=>{
    const user = users.find(user => user.userId === req.params.userId)
    if (!user) res.status(404).send('kindly sign in or register to make an order')
    else {const product = products.find(products => products.productId === req.body.productId)
    const newOrder = {}
    newOrder.userId = req.params.userId
    newOrder.userOrders= []
    newOrder.userOrders.orderId = newOrder.userId 
    newOrder.userOrders.productId = req.params.productId
    newOrder.userOrders.orderQty = req.body.quantity
}


})

module.exports = orderRouter;