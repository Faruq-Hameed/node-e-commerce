const express = require('express')
const { products, users, allUsersOrders } = require("../../database")
const {getUser, getUserIndex, getItem} = require('../../modules') 


const payment = express.Router()

payment.get('/:userId', (req, res) => {
    let user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send('unauthorized user')

    if (req.params.userId === 'u1') { // if user is trying to get his balance over the call center
        user = getUser(users, req.body.userId) // get the user/caller by userId provided
        if (req.body.email !== user.email || req.body.name !== user.name || req.body.username !== user.username) {
            return res.status(401).send('identity verification failed. Tell user to login and try again himself.')
        }
    }
    res.status(200).send(` Your wallet balance is $${user.walletBalance} \n Thank you`)

})

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

payment.put('/:userId', (req, res)=>{
    const user = users.find(user => user.userId === req.params.userId)
    const userName = req.body.userName.toLowerCase() 
    const password = req.body.password && user.password === req.body.password
    const topUpValue = parseInt(req.body.credit)
    if (!userName || !password) {
        res.status(404).send('provide correct username and password');
        return
    }
    if (!req.params.userId){
        res.status(403).send('unauthorized user');
        return
    }

    if (!topUpValue){
        res.status(404).send('bad request');
    return
    }
    user.walletBalance += topUpValue
    res.status(200).send(`You just added $${topUpValue} to your wallet and new balance is: $${user.walletBalance}`);
}

)


module.exports = payment