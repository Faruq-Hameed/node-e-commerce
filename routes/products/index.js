const express = require('express');
const { products, users } = require("../../database")
const router = express.Router()
// const { getItem, getItemIndex } = require('../../modules')
const { Products, User } = require('../../database/models')
const { doesProductExist,doesProductExist_2 } = require('../../database')
const { productSchema,productUpdateSchema } = require('../../utils/input_schema')
const { paginate, paginationError } = require('../../utils');
const { response } = require('express');



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
            const paginatedProductsList = paginate(allProducts, req, 'products')
            res.status(200).json(paginatedProductsList)
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    getAllProducts()
})

// searching for products with matching query parameters
router.get('/search/', (req, res, next) => {
    if(req.params.productId){
        return next('route'); 
    }
    const getProductsByQuery = async () => {
        try{
            const value = (req.query.maker)
            ? { maker: req.query.maker } : (req.query.productName)
                ? { productName: req.query.productName } : (req.query.category)
                    ? { category: req.query.category } : false
            const products = await Products.find(value)
          return  res.status(200).send({ products }) 
        }

        catch (err) {
        }
        return res.status(404).send({ message: 'no match found' }) 
    }
    getProductsByQuery()
})


router.get('/:id', (req, res) => {
    const getProductById = async () => {
        try{
            const product = await Products.findById(req.params.id);
            res.status(200).json({ product });

        }
        catch(err){
            res.status(404).send({ message: 'product with the id does not exist' })

        }
    }
    getProductById()
})



//only admin user should have the permissions to do everything below;
router.use('/:userId',(req, res, next) => {
    const admin = { id: process.env.adminId, name: process.env.adminName }
    console.log(req.params.userId)
    if (req.params.userId && req.params.userId === admin.id) {
        return next()
    }
    res.status(401).send({ message: 'unauthorized user' })
})

router.post('/:userId', (req, res) => {
    const validation = productSchema(req.body)
    if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
    }
    const createNewProduct = async () => {
        try {
            const newProduct = await Products.create(validation.value)
            res.status(200).send({ message: 'new product added successfully', newProduct })
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    }
        createNewProduct()

})

router.put('/:userId/:productId', (req, res) => {
    // validating the data input
    const validation = productSchema(req.body)
    if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
    }

    //update product with the new values from validation if no errors
    const updateProduct = async () => {
        const product = await Products.findById(req.params.productId);

        product.availableQuantity += validation.value.availableQuantity;
        delete validation.value.availableQuantity; //after it is been updated so it wont be in the loop

        for (keys in validation.value) {
            product[keys] = validation.value[keys]
        }
        await product.save()
        return res.status(200).send({ message: 'updated product successfully', product: product })
    }

    //calling the created functions and create a new product if it doesn't exist
    const startProcess = async () => {
       
        try {
            const product = await Products.findById(req.params.productId);
            await updateProduct()

        }
        catch (err) {
            { //if the product id does not exist
                const newProduct = await Products.create(validation.value)
                res.status(200).send({ message: 'new product added successfully', newProduct })
                return
            }
        }
    }

    startProcess()

})

router.patch('/:userId/:productId', (req, res) => {
     // validating the data input
     const validation = productUpdateSchema(req.body)
     if (validation.error) {
         res.status(422).send(validation.error.details[0].message);
         return;
     }

        //update product with the new values from validation if no errors
    const updateProduct = async () => {
        try{
            const product = await Products.findById(req.params.productId);

            product.availableQuantity += validation.value.quantity
            delete validation.value.availableQuantity; //after it is been updated so it wont be in the loop

            for (keys in validation.value) {
                product[keys] = validation.value[keys]
            }
            await product.save()
            return res.status(200).send({ message: 'updated product successfully', product: product })
        }
        //error response
        catch (err) {
            res.status(404).send({ message: 'product not found to update' })
        }
    }
    updateProduct()

})

router.delete('/:userId/:productId', (req, res) => {
    const deleteProduct = async () => {
        try {
            const product = await Products.findByIdAndDelete(req.params.productId);
            if (!product) {
                res.status(410).send({ message: "Product has already deleted" }) //incase null was returned
                return
            }
            res.status(200).send({ message: 'Product deleted successfully' })
            
        }
        catch (err) {
            res.status(404).send({ message: 'product not found to delete' })
        }
    }
    deleteProduct()
})

//needed to check if a user is allowed to access some routes(meant for admin only)
const getUserById = async (req) => {
    const user = await User.findById(req.params.userId);
    return user
}

const getProductById = async (req) => {
    const product = await Products.findById(req.params.productId);
    return product
}

module.exports = router