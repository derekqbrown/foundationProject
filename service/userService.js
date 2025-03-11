const userDao = require("./dao/userDAO");

async function createUser(user_name, password){
    const result = await userDao.createUser({user_name, password});

    if(!result){
        return {message: "Failed to create user"};
    }else{
        return {message: "Created user: ", user: result}
    }
}

async function getUser(user_name){
    const result = await userDao.getUser(user_name);

    if(!result){
        return {message: "Failed to get user: ", user_name};
    }else{
        return {message: "Found user: ", user_name, user: result}
    }
}

async function deleteUser(user_id){
    const result = await userDao.deleteUser(user_id);

    if(!result){
        return {message: "Failed to delete user: ", user_id};
    }else{
        return {message: "Deleted user: ", user_id}
    }
}
module.exports = {createUser, getUser, deleteUser}