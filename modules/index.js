function getUser(arr, reqUrl){
    const item = arr.find(user => user.userId === reqUrl);
    return item 
}

function getItem(arr, key, reqUrl){
    const item = arr.find(obj => obj[key] === reqUrl);
    return item 
}

function getItemIndex(arr, key, reqUrl){
    const item = arr.findIndex(obj => obj[key] === reqUrl);
    return item 
}

function getUserIndex(arr, reqUrl){
    const index = arr.findIndex(user => user.userId === reqUrl);
    return index 
}

module.exports = {getUser,getUserIndex, getItem, getItemIndex};