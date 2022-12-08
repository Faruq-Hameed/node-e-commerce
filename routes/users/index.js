const express = require('express');
const { users, products, allUsersOrders } = require('../../database')
const {getUser, getUserIndex, getItem} = require('../../modules') 

const userRouter = express.Router();



userRouter.get('/', (req, res) => {
    const admin = getItem(users, "userName", 'admin')
    if (req.body.userName === admin.userName && req.body.password === admin.password) {
        res.json({ subscribersInfo: users })
        return
    }
    res.status(401).send('unauthorized')
})

userRouter.get('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    // const user = users.find(user => user.userId === req.params.userId)
    if (!user) return res.status(401).send('unknown user') 

    const userInfo = {}
    for (keys in user) {
        if (keys === "password" || keys === "walletBalance" ||keys === "email" ) continue //to hide the password & wallet balance
        userInfo[keys] = user[keys]
    }
    res.status(200).json({ userInfo})
})

userRouter.post('/', (req, res) => {
    const newUser = req.body
    if (newUser.name && newUser.email && newUser.password && newUser.userName) { //checking if all fields are provided
        newUser.userId = 'u' + (users.length + 1)
        newUser.walletBalance = req.body.credit || 0
        delete req.body.credit
        newUser.status = true
        newUser.dateSignedUp = new Date()
        users.push(newUser) //adding new user to the database
        const newUserCart = {//creating an  empty cart object for the new user
            userId: newUser.userId,
            userOrders: []
        }
        allUsersOrders.push(newUserCart) // adding the empty cart object to the database
        res.status(200).json({ userSummary: newUser })
    }
    else res.status(404).send("kindly input the required fields")
})

userRouter.patch('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send("unknown user")
    for (keys in req.body) {
        user[keys] = req.body[keys]
    }
    res.status(200).json({ "update successfully": user })

})

userRouter.delete('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send("unknown user")

    const userIndex = getUserIndex(users, req.params.userId)

    //const userCart = allUsersOrders.find(user => user.userId === req.params.userId)// former logic
    const userCart = getUser(allUsersOrders, req.params.userId)
    users.splice(userIndex, 1) // remove the user from the list
    userCart.userOrders.length = 0 //emptying the user cart for all orders but the user cart is still present
    res.status(200).send("delete successfully, your cart is emptied we hope to see you again")

})
module.exports = userRouter