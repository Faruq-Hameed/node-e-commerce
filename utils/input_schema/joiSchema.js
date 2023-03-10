const joi = require("joi");

function signUpSchema(inputs) { //user sign up schema (post & put request)
    const schema = joi.object({
        userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        lastName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        email: joi.string().email().trim(true).required(),
        password : joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w]).{8,}$/).required(),
        mobileNumber: joi.string().length(11).pattern(/[6-9]{1}[0-9]{9}/).required(),
        birthYear: joi.number().integer().min(1920).max(2000).required(),
        is_active: joi.boolean().default(true),
        
    })
    return schema.validate(inputs)
}
function userPutMethodSchema(inputs) { //user sign up schema (post & put request)
    const schema = joi.object({
        userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        lastName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        email: joi.string().email().trim(true).required(),
        mobileNumber: joi.string().length(11).pattern(/[6-9]{1}[0-9]{9}/).required(),
    })
    return schema.validate(inputs)
}

function productSchema (inputs){
    const schema = joi.object ({
        productName: joi.string().min(3).max(25).trim(false).required(),
        maker: joi.string().min(3).max(200).trim(false).required(),
        description : joi.string().min(3).max(200).trim(false).required(),
        category: joi.string().alphanum().min(3).max(25).trim(false).required(),
        availableQuantity: joi.number().default(1).min(0),
        productPrice: joi.number().default(0).min(0).required(),
        soldQuantity: joi.number().min(0),
    })
    return schema.validate(inputs)
}

function productUpdateSchema (inputs){
    const schema = joi.object ({
        productName: joi.string().min(3).max(25).trim(false),
        maker: joi.string().min(3).max(200).trim(false),
        description : joi.string().min(3).max(200).trim(false),
        category: joi.string().min(3).max(25).trim(false),
        quantity: joi.number().default(0).min(0),
        productPrice: joi.number().min(0),
    })
    return schema.validate(inputs)
}

module.exports = {signUpSchema,userPutMethodSchema,productSchema,productUpdateSchema}