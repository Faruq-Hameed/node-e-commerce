const express = require('express')
const { products, users, allUsersOrders } = require("../database")

const orderRouter = express.Router()

// orderRouter.post('*', (req, res) => {
//     res.status(404).send('unknown request')
// })

orderRouter.get('/:userId', (req, res)=>{
    const user = users.find(user => user.userId === req.params.userId)
    if (!user) res.status(404).send('unknown user')

    if(req.params.userId === 'u1') res.status(200).json({allUsersOrders});

    if (user && req.params.userId !== 'u1') { // for non-admin users
        const userOrder = allUsersOrders.find(user => user.userId === req.params.userId)

        if(userOrder.userOrders.length === 0) res.status(200).send('your cart is empty')

        else {
            let orderSummary = 'below is your cart summary: \n \n'
            let i = 0
            userOrder.userOrders
                .map(function (order) {
                    orderSummary += `${++i}). orderId: ${order.orderId} ; productId ${order.productId} ; quantity: ${order.orderQty}kg;
        with value: $${order.orderValue} `
                })
                res.status(200).send(orderSummary)    
        }
        
    }
    
})


orderRouter.post('/',(req, res)=>{
    const currentUserOrder = allUsersOrders.find(user => user.userId === req.body.userId) 
    const product = products.find(products => products.productId === req.body.productId)
    if (!currentUserOrder) res.status(404).send('kindly sign in or register to make an order')
    if (!product) res.status(404).send('order out of stock or not found')
    else if (!req.body.quantity) res.status(404).send('provide a valid quantity')

    else {
        const newOrder = {} //initiating an empty order object
        newOrder.orderId = req.body.userId + 'Or' + (currentUserOrder.userOrders.length + 1)
        newOrder.productId = req.body.productId
        newOrder.orderQty = parseInt(req.body.quantity)
        newOrder.orderValue = parseInt(req.body.quantity) * parseInt(product.pricePerUnit)

        currentUserOrder.userOrders.push(newOrder) //adding the new order to the user Order in the database
        product.productQty = product.productQty - newOrder.orderQty // subtracting the product from the database
        product.soldQty = product.soldQty + newOrder.orderQty //updating the product sold in the database
        res.status(200).send({newOrder: newOrder})
    }


})

orderRouter.put('/:userId/:orderId', (req, res) => {
    // getting the user entire cart detail from all users carts in store(database)
    const currentUserOrder = allUsersOrders.find(user => user.userId === req.params.userId)
    if (!currentUserOrder) {
        res.status(404).send('unauthorized user'); return       
    }
    if (currentUserOrder){
        //getting the user cart items to see if the order exist in his userOrders(cart)
        const orderToUpdate = currentUserOrder.userOrders.find(order => order.orderId === req.params.orderId)
        if (orderToUpdate) {
            const product = products.find(product => product.productId === orderToUpdate.productId)
                if(orderToUpdate.orderQty > parseInt(req.body.quantity)){
                    // updating the product quantity in the store i.e database
                    product.productQty = product.productQty + (orderToUpdate.orderQty - parseInt(req.body.quantity)) 
                    product.soldQty = product.soldQty  - (orderToUpdate.orderQty - parseInt(req.body.quantity))
            
                    orderToUpdate.orderQty = parseInt(req.body.quantity) // updating the user cart with the reduced quantity
                    res.status(200).end('order successfully updated with the new quantity')
                
                }
            else if (orderToUpdate.orderQty < parseInt(req.body.quantity)
                && product.productQty >= parseInt(req.body.quantity)) {
                // updating the product quantity in the store i.e database
                product.productQty = product.productQty - (parseInt(req.body.quantity) - orderToUpdate.orderQty)
                product.soldQty = product.soldQty + (parseInt(req.body.quantity) - orderToUpdate.orderQty)

                orderToUpdate.orderQty = parseInt(req.body.quantity) // updating the user cart with the increased quantity
                res.status(200).end('order successfully updated with the new quantity')

            }
            else res.status(404).send(`your new quantity is not available kindly buy less than ${parseInt(req.body.quantity)}`)

        }
        else res.status(404).send('no valid order found')
       }
  
})


orderRouter.delete('/:userId/:orderId', (req, res) => {
    const currentUserOrder = allUsersOrders.find(user => user.userId === req.params.userId)
    const orderToDelete = currentUserOrder.userOrders.find(order => order.orderId === req.params.orderId)
    const orderIndex = currentUserOrder.userOrders.findIndex(order => order.orderId === req.params.orderId)
    const product = products.find(product => product.productId === orderToUpdate.productId)
    if (!currentUserOrder) {
        res.status(404).send('unauthorized'); return
    }
    if (!orderToUpdate && !product) {
        res.status(404).send('unknown orderId'); return
    }

    // updating the product quantity in the store i.e database
    product.productQty = product.productQty + orderToDelete.orderQty // returning the quantity back to the store(database)
    product.soldQty = product.soldQty - orderToDelete.orderQty // subtracting from the quantity outside the store
    currentUserOrder.userOrders.splice(orderIndex, 1) // deleting the order from the user cart
    res.status(200).send('order successfully deleted');
})
module.exports = orderRouter;