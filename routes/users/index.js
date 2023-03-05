const express = require('express');
const { users, products, allUsersOrders } = require('../../database')
const {getUser, getUserIndex, getItem} = require('../../modules') 
const {db_connection} = require('../../database/mongoDb')
const User = require('../../database/models/user')
const Password = require('../../database/models/password')
const {signUpSchema} = require('../../utils/input_schema/user')
const {doesUserExist} = require('../../utils/errors/users')
const {securePassword} = require('../../database/password') 


const userRouter = express.Router();


userRouter.get('/db', (req, res) => {
    const new_article = async () => {
       const article = await Blog.create({
            title: 'Awesome Post90!',
            slug: 'awesome-post90',
            published: true,
            content: 'This is the best post ever',
            tags: ['featured', 'announcement'],
        })
    console.log(article)
        return article
    }
    const main = async () => {
        try{
           await new_article()
           .then(article =>{
            res.status(200).json(
                {
                    message : "success",
                    new_article : article
                }
            )
           })
            
        }
        catch(err) {
            res.status(500).json(
                {
                    message : "failed",
                }
            )
        }
       
    }
    main()

})

userRouter.get('/', (req, res) => {
    async function getAllUsers(){
        try{
            const allUsers = await User.find({})
            res.status(200).json(allUsers)
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }
    getAllUsers()
})

userRouter.get('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    // const user = users.find(user => user.userId === req.params.userId)
    if (!user) return res.status(401).send('unknown user') 

    const userInfo = {}
    for (keys in user) {
        if (keys === "password" || keys === "walletBalance" ||keys === "email" ) continue //to hide the password, wallet balance & email
        userInfo[keys] = user[keys]
    }
    res.status(200).json({ userInfo})
})

userRouter.post('/', (req, res) => {
    //validating the user inputs with joi schema
    const validation = signUpSchema(req.body) 
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    
    const signUp = async () => {
        try {
            //checking if the values are not already in the database
            const itemExist = await doesUserExist(User,validation.value,'email', 'userName', 'mobileNumber', res)
            if(itemExist) {
                return res.status(itemExist.status).json({message:itemExist.message})
            }; 

            //storing the validated objects to the database
            const newUser = await User.create(validation.value);

            const password = await Password.create({
                password: await securePassword(validation.value.password),
                user_id: newUser._id
            })            
            
            res.status(200).json({ userSummary: newUser, password: password});
        }
        catch (err) {
            res.status(400).send(err.message);

        }
    }
    signUp()


    // const newUser = req.body
    // if (newUser.name && newUser.email && newUser.password && newUser.userName) { //checking if all fields are provided
    //     newUser.userId = 'u' + (users.length + 1)
    //     newUser.walletBalance = req.body.credit || 0
    //     delete req.body.credit//credit is deleted if present because wallet balance is recognized not credit
    //     newUser.status = true
    //     newUser.dateSignedUp = new Date()
    //     users.push(newUser) //adding new user to the database
    //     const newUserCart = {//creating an  empty cart object for the new user
    //         userId: newUser.userId,
    //         userOrders: []
    //     }
    //     allUsersOrders.push(newUserCart) // adding the empty cart object to the database
    //     res.status(200).json({ userSummary: newUser })
    // }
    // else res.status(404).send("kindly input the required fields")
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
    users.splice(userIndex, 1) // remove the user from the list(database)
    userCart.userOrders.length = 0 //emptying the user cart for all orders but the user cart is still present
    res.status(200).send("delete successfully, your cart is emptied we hope to see you again")

})
module.exports = userRouter