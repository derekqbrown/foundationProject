const userDao = require("./dao/userDAO");
const bcrypt = require("bcrypt");

async function createUser(username, password){
    if(username.length < 1 || password.length < 1){
        return {message: "Username or password is too short"};
    }
    const result = await userDao.createUser({username, password});

    if(!result){
        return {message: "Failed to create user"};
    }else{
        return {message: "Created user: ", user: result}
    }
}

async function loginUser(username, password){
    const user = await userDao.getUserByUsername(username);

    //token here
    if(user && (await bcrypt.compare(password, user.password)) ){
        return user;
    }else{
        return null;
    }
}

async function getUserByUsername(username){
    const result = await userDao.getUserByUsername(username);

    if(!result){
        return {message: "Failed to get user: ", username};
    }else{
        return {message: "Found user: ", username, user: result}
    }
}

async function updateUser(userId, newPassword = null, newRole = null){
    const result = await userDao.getUserByUserid(userId);

    if (newPassword) { 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateExpression += ' #password = :password';
        expressionAttributeValues[':password'] = hashedPassword;
    }
    
    if (newRole) {
        if (newPassword) {
            updateExpression += ',';
        }
        updateExpression += ' #role = :role';
        expressionAttributeValues[':role'] = newRole;
    }

    if(!result){
        return {message: "Failed to get user"};
    }else{
        return {message: "Updated user: ", username, user: result}
    }
}

module.exports = {createUser, loginUser, getUserByUsername, updateUser }