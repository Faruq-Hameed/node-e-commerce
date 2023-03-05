const {signUpSchema} = require('../input_schema/user')

function joiSchemaError(input) {
    const validation = signUpSchema(input) 
    if (validation.error) {
        let result = { status: 422, message: validation.error.details[0].message }
        return result;
    }
    else return validation.value;
}

module.exports = {joiSchemaError}