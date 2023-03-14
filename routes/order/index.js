const express = require('express')
// const { products, users, allUsersOrders } = require("../../database")
// const {getUser, getUserIndex, getItem} = require('../../modules') 
const { Item, User,User_Cart } = require('../../database/models')
const { itemSchema,itemUpdateSchema } = require('../../utils/input_schema')
const { paginate, paginationError } = require('../../utils');

const router = express.Router()


router.get('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send('unknown user')

    if (req.params.userId === 'u1') res.status(200).json({ 'All Users Orders': allUsersOrders }); // for admin user & get all orders

    // for non-admin users i.e for getting a specific user order summary
    const userOrder = getUser(allUsersOrders, req.params.userId)
    if (userOrder.userOrders.length === 0) return res.status(200).send('your cart is empty')

    let orderSummary = 'below is your cart summary: \n \n' //if user cart is not empty
    let i = 0;
    userOrder.userOrders.map( order => { // trying to return user carts as a summarized sentences
            orderSummary += `\n ${++i}). orderId: ${order.orderId} ; productId ${order.productId} ; quantity: ${order.orderQty}kg;with value: $${order.orderValue} `
        })
    res.status(200).send(orderSummary)

})

//getting a specific order information for a given userId with the orderId
router.get('/:userId/:orderId', (req, res) => {
    const getOrderInfo = allUsersOrders.find(user => user.userOrders //getting the order by the order id
        .find(order => order.orderId === req.params.orderId))
    if (!getOrderInfo) return res.status(404).send('unknown request. The order doesn\'t exist');   

     // if the user doesn't exist or request is an orderId of another user && the user is not an admin
    if (req.params.userId !== 'u1' && getOrderInfo.userId !== req.params.userId) return res.status(401).send('unauthorized request/user')
        // an admin user can access any order with the id
        const orderToGet = getItem(getOrderInfo.userOrders, "orderId", req.params.orderId)
        const product = getItem(products, "productId", orderToGet.productId)
        const orderSummary = `order summary: \n \n orderId: ${orderToGet.orderId} \n productId: ${orderToGet.productId} \n productName: ${product.productName} \n order quantity: ${orderToGet.orderQty}kg \n order value: $${orderToGet.orderValue} \n`

        res.status(200).send(orderSummary)
})


router.post('/', (req, res) => {
    const product = getItem(products, "productId", req.body.productId)
    const currentUserOrder = getUser(allUsersOrders, req.body.userId)

    if (!currentUserOrder) return res.status(401).send('kindly sign in or register to make an order')
    if (!product || product.productQty === 0) return res.status(404).send('product not found or out of stock')
    if (!req.body.quantity || parseInt(req.body.quantity) * 0 !== 0) return res.status(404).send('provide a valid quantity')
    if(parseInt(req.body.quantity) > product.productQty) return res.status(400).send(`we only have ${product.productQty}kg in stock`)
    
        const newOrder = {} //initiating an empty order object
        newOrder.orderId = req.body.userId + 'Or' + (currentUserOrder.userOrders.length + 1)
        newOrder.productId = req.body.productId
        newOrder.orderQty = parseInt(req.body.quantity)
        newOrder.orderValue = parseInt(req.body.quantity) * parseInt(product.pricePerUnit)

        currentUserOrder.userOrders.push(newOrder) //adding the new order to the user Order in the database
        product.productQty = product.productQty - newOrder.orderQty // subtracting the product from the stock value in the database
        product.soldQty = product.soldQty + newOrder.orderQty //updating the product sold in the database
        res.status(200).send({ newOrder: newOrder })

})

router.put('/:userId/:orderId', (req, res) => {
    // getting the user entire cart detail from all users carts in store(database)
    const currentUserOrder = getUser(allUsersOrders, req.params.userId)
    if (!currentUserOrder) return  res.status(401).send('unknown user'); 
        //getting the user cart items to see if the order exist in his userOrders(cart)
        const orderToUpdate = currentUserOrder.userOrders.find(order => order.orderId === req.params.orderId)
        if (!orderToUpdate) return res.status(404).send('no valid order found')
        if (!req.body.quantity || parseInt(req.body.quantity) * 0 !== 0) return res.status(404).send('provide a valid quantity')

            const product = getItem(products, "productId", orderToUpdate.productId)
            // updating the product quantity in the stock and user cart i.e database
            if (orderToUpdate.orderQty > parseInt(req.body.quantity)) {
                product.productQty = product.productQty + (orderToUpdate.orderQty - parseInt(req.body.quantity))
                product.soldQty = product.soldQty - (orderToUpdate.orderQty - parseInt(req.body.quantity))

                orderToUpdate.orderQty = parseInt(req.body.quantity) // updating the user cart with the reduced quantity
                res.status(200).end('order successfully updated with the new quantity')

            }
            else if (orderToUpdate.orderQty < parseInt(req.body.quantity) && orderToUpdate.orderQty + product.productQty >= parseInt(req.body.quantity)) {
                product.productQty = product.productQty - (parseInt(req.body.quantity) - orderToUpdate.orderQty)
                product.soldQty = product.soldQty + (parseInt(req.body.quantity) - orderToUpdate.orderQty)

                orderToUpdate.orderQty = parseInt(req.body.quantity) // updating the user cart with the increased quantity
                res.status(200).end('order successfully updated with the new quantity')
            }
            else res.status(404).send(`your new quantity is not available kindly buy ${parseInt(product.productQty) + orderToUpdate.orderQty }kg or less`)

})


router.delete('/:userId/:orderId', (req, res) => {
    const getOrderInfo = allUsersOrders.find(user => user.userOrders
        .find(order => order.orderId === req.params.orderId))
    if (!getOrderInfo) return res.status(404).send('unknown request. The order doesn\'t exist');   
    //non admin trying to delete an order with the orderId of another user or unkonwn orderId    
    if (req.params.userId !== 'u1' && getOrderInfo.userId !== req.params.userId) return res.status(401).send('unauthorized user'); 
        
    const orderToDelete = getItem(getOrderInfo.userOrders, "orderId", req.params.orderId)
    const orderIndex = getOrderInfo.userOrders.findIndex(order => order.orderId === req.params.orderId)
    const product = getItem(products, "productId", orderToDelete.productId)

    // updating the product quantity in the stock i.e database
    product.productQty += orderToDelete.orderQty // returning the quantity back to the store(database)
    product.soldQty -= orderToDelete.orderQty // subtracting from the quantity outside the store
    getOrderInfo.userOrders.splice(orderIndex, 1) // deleting the order from the user cart
    res.status(201).end('order successfully deleted');

})
module.exports = router;