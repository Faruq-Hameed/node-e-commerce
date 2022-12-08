const express = require('express')
const { products, users, allUsersOrders } = require("../../database")
const {getUser, getUserIndex, getItem} = require('../../modules') 


const payment = express.Router()



payment.post('/', (req, res) => {

    //orderId is majorly used to find the order while userId is only used for authorization purposes
    const getOrderInfo = allUsersOrders.find(user => user.userOrders
        .find(order => order.orderId === req.body.orderId))

    if (!getOrderInfo) return res.status(404).send('unknown request. The order doesn\'t exist');        
    //userId is used for authorization. an admin(e.g call center rep) can make payment but with valid orderId
    if (req.body.userId !== 'u1' && req.body.userId !== getOrderInfo.userId) return res.status(401).send('unauthorized user id');
        
    const user = users.find(user => user.userId === getOrderInfo.userId) //using orderId to get the user
    if((user.password !== req.body.password && req.body.userId !== 'u1') || user.email !== req.body.email ) return res.status(401).send('incorrect login credentials');
    const orderValue = getOrderInfo.userOrders
        .find(order => order.orderId === req.body.orderId)
        .orderValue
    if (user.walletBalance >= orderValue) {
        user.walletBalance -= orderValue // removing the order value from client's wallet
        const orderIndex = getOrderInfo.userOrders.findIndex(order => order.orderId === req.body.orderId)
        getOrderInfo.userOrders.splice(orderIndex, 1) // removing the order from client's cart

        //sending response with the receipt
        res.status(200).send((`payment successful. Expect your order in your mail within 7days 
        Payment receipt \n customer name: ${user.name} \n customer email: ${user.email}}
        order id: ${req.body.orderId} \n order value: $${orderValue}
        `))
        return
    }
    if (user.walletBalance < orderValue) {
        const amountNeeded = orderValue - user.walletBalance
        res.status(202).send(`insufficient wallet balance top of with at least $${amountNeeded} to complete the order`)
    }
})




module.exports = payment