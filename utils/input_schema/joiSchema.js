const joi = require("joi");

function signUpSchema(input) { //user sign up schema (post & put request)
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
    return schema.validate(input)
}
function userPutMethodSchema(input) { //user sign up schema (post & put request)
    const schema = joi.object({
        userName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        lastName: joi.string().alphanum().min(3).max(25).trim(true).required(),
        email: joi.string().email().trim(true).required(),
        mobileNumber: joi.string().length(11).pattern(/[6-9]{1}[0-9]{9}/).required(),
    })
    return schema.validate(input)
}

module.exports = {signUpSchema,userPutMethodSchema}