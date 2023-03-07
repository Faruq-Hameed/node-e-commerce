const express = require('express');
const { products, users } = require("../../database")
const router = express.Router()
// const { getItem, getItemIndex } = require('../../modules')
const { Products, User } = require('../../database/models')
const { doesProductExist } = require('../../database')
const { productSchema } = require('../../utils/input_schema')
const { paginate, paginationError } = require('../../utils');


router.get('/', (req, res) => { ///****** needed adjustment. Anyone should have access to this */
    async function getAllProducts() {
        try {
            const allProducts = await Products.find({})

            //paginating the results to be returned to the user
            const error = paginationError(allProducts, req)
            if (error) {
                res.status(error.status).json({ message: error.message })
                return;
            }
            const paginatedProductsList = paginate(allProducts, req)
            res.status(200).json(paginatedProductsList)
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    getAllProducts()
})

router.get('/:id', (req, res) => {
    const getProductById = async () => {
        const product = await Products.findById(req.params.id);
        if (!product) {
            res.status(404).send({ message: 'product with the id does not exist' })
            return;
        }
        res.status(200).json({ product });
    }
    getProductById()
})

//only admin user should have the permissions to do everything in this post request;
router.post('/:userId', (req, res) => {
    const validation = productSchema(req.body)
    if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
    }

    const createNewProduct = async () => {

        try {
            const productAlreadyExist = await doesProductExist(Products, validation.value, 'productName');
            if (productAlreadyExist) { //if we already have product that matches the new Product name
                return res.status(productAlreadyExist.status).json({ message: productAlreadyExist.message })
            };

            const newProduct = await Products.create(validation.value)
            res.status(200).send({ message: 'new product added successfully', newProduct })
        }
        catch (err) {
            res.status(400).send(err.message);

        }
    }
    const main = async () =>{
        const isAdmin = await getUserById()
        if (!isAdmin || isAdmin.userName !== 'admin'){
            res.status(401).send({message: 'unauthorized user'}); 
            return;
        }
    // if the user is an admin, then the product update will proceed
        createNewProduct()
    }
    main()
 
})

router.put('/:userId/:productId', (req, res) => {

    const validation = productSchema(req.body)
    if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
    }
    const updateTheProduct = async () => {
        const productAlreadyExist = doesProductExist(Products, validation.value, 'productName');
        if (productAlreadyExist) { //if we already have user that matches the email,username or mobileNumber
            return res.status(itemExist.status).json({ message: itemExist.message })
        };

    }


    //     const product = getItem(products, "productId", req.params.productId) // to get the product if it exists
    //     if (product) {
    //         const productIndex = getItemIndex(products, "productId", req.params.productId);

    //         const updatedProduct = req.body
    //         updatedProduct.productId = product.productId
    //         updatedProduct.productQty = (product.productQty > 0) ? product.productQty + req.body.quantity : req.body.quantity
    //         delete req.body.quantity

    //         products.splice(productIndex, 1, updatedProduct)
    //         res.status(200).json({ 'updated product': updatedProduct })
    //     }
    //     else { // if the product doesn't exist /// \\\\*** needed to be updated for possible errors
    //         const newProduct = req.body
    //         newProduct.productId = 'p' + (products.length + 1)
    //         newProduct.productQty = req.body.quantity
    //         delete req.body.quantity
    //         products.push(newProduct)
    //         res.status(201).end(`new product created with ${newProduct.productId}`)
    //     }
})

router.patch('/:userId.:productId', (req, res) => {
    if (!req.body.quantity) return res.status(404).send('no input found to update');
    if (req.params.userId !== 'u1') return res.status(401).json('unauthorized user') // if user is not an admin   

    const product = getItem(products, "productId", req.params.productId)

    if (!product) return res.status(404).send('product not found to update') //if productId doesn't exist

    for (value in req.body) {
        if (value === 'quantity') {
            product.productQty = req.body.quantity
        }
        product[value] = req.body[value]
    }
    res.status(200).json({ 'update successful': product })
})

router.delete('/:userId/:productId', (req, res) => {
    if (req.params.userId !== 'u1') return res.status(401).end('unauthorized user')
    const productIndex = getItemIndex(products, "productId", req.params.productId)

    if (productIndex < 0) return res.status(404).end('product not found')

    products.splice(productIndex, 1)
    res.status(200).end('successfully delete')
})

//needed to check if a user is allowed to access some routes(meant for admin only)
const getUserById = async () => {
    const isAdmin = await User.findById(req.params.userId);
    return isAdmin
}

module.exports = router