const express = require('express');
// const { users, products, allUsersOrders } = require('../../database')
// const {getUser, getUserIndex, getItem} = require('../../modules') 
const {Password, User, Product} = require('../../database/models')
const {securePassword, doesUserExist} = require('../../database') 
const {signUpSchema} = require('../../utils/input_schema')


const router = express.Router();

router.get('/db', (req, res) => {
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

router.get('/', (req, res) => {
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

router.get('/:userId', (req, res) => {
    const getUserById = async () => {
        try {
            const user = await User.findById(req.params.userId)
            res.status(200).send({ user })
        }
        catch (err) {
            return res.status(401).send('unknown user')
        }

    }
    getUserById()

})

router.post('/', (req, res) => {
    //validating the user inputs with joi schema
    const validation = signUpSchema(req.body)
    if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
    }

    const signUp = async () => {
        try {
            //checking if the values are not already in the database
            const itemExist = await doesUserExist(User, validation.value, 'email', 'userName', 'mobileNumber', res)
            if (itemExist) {
                return res.status(itemExist.status).json({ message: itemExist.message })
            };

            //storing the validated objects to the database
            const newUser = await User.create(validation.value);

            const password = await Password.create({
                password: await securePassword(validation.value.password),
                user_id: newUser._id
            })

            res.status(200).json({ userSummary: newUser, password: password });
        }
        catch (err) {
            res.status(400).send(err.message);

        }
    }
    //calling the async function for the signup process
    signUp()
})

router.patch('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send("unknown user")
    for (keys in req.body) {
        user[keys] = req.body[keys]
    }
    res.status(200).json({ "update successfully": user })

})

router.delete('/:userId', (req, res) => {
    const user = getUser(users, req.params.userId)
    if (!user) return res.status(401).send("unknown user")

    const userIndex = getUserIndex(users, req.params.userId)

    //const userCart = allUsersOrders.find(user => user.userId === req.params.userId)// former logic
    const userCart = getUser(allUsersOrders, req.params.userId)
    users.splice(userIndex, 1) // remove the user from the list(database)
    userCart.userOrders.length = 0 //emptying the user cart for all orders but the user cart is still present
    res.status(200).send("delete successfully, your cart is emptied we hope to see you again")

})
module.exports = router