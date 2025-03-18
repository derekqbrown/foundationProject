const userDao = require("../repository/userDAO");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const logger = require("../util/logger");
const { getJWTSecret} = require("../util/getJWTKey");

const saltNumber = 10;

async function createUser(user){
    let username = user.username;

    if(username.length < 1 || user.password.length < 1){
        return {message: "Username or password is too short"};
    }
    let hashedPassword = await bcrypt.hash(user.password, saltNumber);

    const newUser = {
        userId: uuidv4(),
        username: username,
        password: hashedPassword,
        role: user.role || 'EMPLOYEE'
    };

    const result = await userDao.postUser(newUser);
    if(!result){
        logger.error("Failed to create user");
        return {message: "Failed to create user"};
    }else{
        logger.info("User created", result);
        return {message: "User created", user: result}
    }
}

const loginUser = async (username, password) => {
    const JWT_SECRET_KEY = await getJWTSecret();
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
            role: user.role || 'EMPLOYEE',
        };

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
        logger.info("Login successful");
        return {message: "Login successful", token: token }; 
    } catch (error) {
        logger.error("An error occurred: ", error);
        return {message: "An error occurred"};
    }
};

async function getUser(username){
    if(username.length < 1){
        logger.error("Username is too short");
        return {message: "Username is too short"};
    }
    const data = await userDao.getUserByUsername(username);

    if(!data){
        return {message: "User not found"};
    }
    return {message: "User found", user:data};
    
}
async function updateUserPassword(userId, newPassword) {
    const user = await userDao.getUserById(userId);

    if (!user) {
        logger.error("User not found");
        return null;
    }
    if(!newPassword || newPassword.length < 1){
        logger.error("Password is too short");
        return {message: "Password is too short"};
    }
    let hashedPassword = await bcrypt.hash(newPassword, saltNumber);
    try {
        const updatedUser = await userDao.updatePassword(userId, hashedPassword, user);

        if(!updatedUser){
            logger.error("Failed to update password.");
            return { message: "Failed to update password." };
        }
        logger.info(`Password updated for user: ${userId}`);
        return { message: `Password updated for user: ${userId}`, user: updatedUser };
    } catch (error) {
        logger.error("An error occurred while updating password.", error);
        return { message: "An error occurred while updating password." };
    }
}
async function updateUserRole(userId) {

    if(req.user.role != "MANAGER"){
        logger.error("User not authorized");
        return { message: "User not authorized" };
    }
    const user = await userDao.getUserById(userId);
    
    if (!user) {
        logger.error("User not found");
        return { message: "User not found" };
    }
    let newRole = newRole === "EMPLOYEE" ? "MANAGER" : "EMPLOYEE";
    try {
        const updatedUser = await userDao.updateRole(userId, newRole, user);
        if(!updatedUser){
            logger.error("Failed to update role.");
            return { message: "Failed to update role." };
        }
        logger.info(`Role updated for user: ${userId}`);
        return { message: `Role updated for user: ${userId}`, user: updatedUser };
    } catch (error) {
        logger.error("An error occurred while updating role.", error);
        return { message: "An error occurred while updating role." };
    }
}

module.exports = {createUser, loginUser, getUser, updateUserPassword, updateUserRole }