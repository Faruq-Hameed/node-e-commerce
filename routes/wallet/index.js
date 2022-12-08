// const express = require('express')
// const { products, users, allUsersOrders} = require('../../database')
// const {getUser, getUserIndex, getItem} = require('../../modules') 


const express = require('express')
const { products, users, allUsersOrders } = require("../../database")
const {getUser, getUserIndex, getItem} = require('../../modules') 


const wallet = express.Router()
// const wallet = express.Router()

wallet.get('/:userId', (req, res) => {
    let user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send('unauthorized user')

    if (req.params.userId === 'u1') { // if user is trying to get his balance over the call center
        user = getUser(users, req.body.userId) // get the user/caller by userId provided i.e via req.body
        
        if (!user || user.email !== req.body.email || req.body.name !== user.name || req.body.username !== user.username) {
            return res.status(401).send('identity verification failed. Tell user to login and try again himself.')
        }
    }
    res.status(200).send(` Your wallet balance is $${user.walletBalance} \n Thank you`)

})



wallet.patch('/:userId', (req, res) => {
    let user = getUser(users, req.params.userId)
    if (req.params.userId === 'u1') { // if user is trying to get his balance over the call center
        user = getUser(users, req.body.userId)
    }
    // get the user/caller by userId provided i.e via req.body
    if (!user || req.body.email !== user.email || req.body.name !== user.name || req.body.username !== user.username) {
        return res.status(401).send('identity verification failed. User should login and try again.')
    }
    const topUpValue = parseInt(req.body.credit)
    if (!topUpValue) return res.status(404).send('credit top up failed provide a valid credit card details');

    user.walletBalance += topUpValue
    res.status(200).send(`You just added $${topUpValue} to your wallet and new balance is: $${user.walletBalance}`);
}

)

module.exports = wallet
