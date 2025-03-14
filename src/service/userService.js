const userDao = require("../repository/userDAO");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const saltNumber = 10;

async function createUser(user){
    let username = user.username;

    if(username.length < 1 || user.password.length < 1){
        return {message: "Username or password is too short"};
    }
    
    let hashedPassword = bcrypt.hash(user.password, saltNumber);

    const newUser = {
        user_id: uuidv4(),
        username: username,
        password: hashedPassword,
        role: user.role || 'EMPLOYEE'
    };

    const result = await userDao.createUser(newUser);

    if(!result){
        return {message: "Failed to create user"};
    }else{
        return {message: "Created user", user: result}
    }
}

const loginUser = async (username, password) => {
    try {
        const user = await userDao.getUserByUsername(username);
        
        if (!user) {
            logger.error("User not found");
            return {message: "User not found"};
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            logger.error("Invalid credentials");
            return {message: "Invalid credentials"};
            
        }
    
        const payload = {
            user_id: user.user_id,
            username: user.username,
        };
        // I need to update the secret key later
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }); 
    
        return { token }; 
    } catch (error) {
        logger.error("An error occurred: ", error);
        return {message: "An error occurred"};
    }
};

async function getUserByUsername(username){
    if(username.length < 1){
        logger.error("Username is too short");
        return {message: "Username is too short"};
    }
    const data = await userDao.getUserByUsername(username);

    if(!data){
        logger.error("User not found");
        return {message: "User not found"};
    }
    return {message: "User found", user:data};
    
}

async function updateUser(userId, newPassword = null, newRole = null) {
    const data = await userDao.getUserByUserid(userId);

    if (!data) {
        logger.error("User not found");
        return null;
    }

    let attributeToUpdate = null;
    let updateMethod = null;
    let updateValue = null;

    if (newPassword) {
        attributeToUpdate = 'password';
        updateMethod = userDao.updatePassword;  
        updateValue = bcrypt.hash(newPassword, saltNumber);;
    }

    if (newRole) {
        attributeToUpdate = 'role';
        updateMethod = userDao.updateRole;  
        updateValue = newRole;
    }

    if (!attributeToUpdate) {
        logger.error("Failed to update. Missing attribute");
        return { message: "Failed to update" };
    }

    try {
        const updatedUser = await updateMethod(userId, updateValue);
        if(!updatedUser){
            logger.error(`Failed to update ${attributeToUpdate}.`);
            return { message: `Failed to update ${attributeToUpdate}.` };
        }
        logger.info(`${attributeToUpdate} updated for user: ${userId}`);
        return { message: `${attributeToUpdate} updated for user: ${userId}`, user: updatedUser };
    } catch (error) {
        logger.error(`An error occurred while updating ${attributeToUpdate}.`, error);
        return { message: `An error occurred while updating ${attributeToUpdate}.` };
    }

}

module.exports = {createUser, loginUser, getUserByUsername, updateUser }