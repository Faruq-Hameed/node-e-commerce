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

const doesItemExist = async (model, value, itemName) => {
    const doesItemNameExist = await model.findOne({ itemName: value[itemName] })
    if (doesItemNameExist) {
        let result = { status: 409, message: 'itemName already exists' }
        return result;
    }
}

const doesItemExist_2 = async (item,model, value,itemName) => {
    const doesItemExist = await model.findOne({ itemName: value[itemName] })
    if (doesItemExist && doesItemExist._id !== item._id) {
        let result = { status: 409, message: 'new item name already exists' }
        return result;
    }
    else return false;
}
module.exports = { doesUserExist, doesUserInfoExist , doesItemExist,doesItemExist_2}
