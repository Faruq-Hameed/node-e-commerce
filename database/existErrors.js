//checking if the username or email or mobile number already exists for post request
const doesUserExist = async (model, value, email, userName, mobileNumber) => {
    const doesUsernameExist = await model.findOne({ userName: value[userName] })
    if (doesUsernameExist) {
        let result = { status: 409, message: 'Username already exists' }
        return result;
    }
    const doesEmailExist = await model.findOne({ email: value[email] })
    if (doesEmailExist) {
        let result = { status: 409, message: 'email already exists' }
        return result;
    }
    const doesMobileNumberExist = await model.findOne({ mobileNumber: value[mobileNumber] })
    if (doesMobileNumberExist) {
        let result = { status: 409, message: 'mobile number already exists' }
        return result;
    }
}

//this is needed for put or patch requests
const doesUserInfoExist = async (user, model, value, email, userName, mobileNumber) => {
    
    const doesUsernameExist = await model.findOne({ userName: value[userName] })
    if (doesUsernameExist && user._id !== doesUsernameExist._id) {
        let result = { status: 409, message: 'Username already exists' }
        return result;
    }
    
    const doesEmailExist = await model.findOne({ email: value[email] })
    if (doesEmailExist && user._id !== doesEmailExist._id) {
        let result = { status: 409, message: 'email already exists' }
        return result;
    }
    

    const doesMobileNumberExist = await model.findOne({ mobileNumber: value[mobileNumber] })
    if (doesMobileNumberExist && user._id !== doesMobileNumberExist._id) {
        let result = { status: 409, message: 'mobile number already exists' }
        return result;
    }
    
}
module.exports = { doesUserExist, doesUserInfoExist }
