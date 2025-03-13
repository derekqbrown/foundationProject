const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");
const bcrypt = require("bcrypt");

const client = new DynamoDBClient({region: "us-west-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Users";
const saltNumber = 10;

async function createUser(user){
    user.password = await bcrypt.hash(user.password, saltNumber);

    const command = new PutCommand({
        TableName,
        Item: user
    });
    try{
        await documentClient.send(command);
        return user;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function getUserById(user_id){
    const command = new GetCommand({
        TableName,
        Key: {user_id}
    });

    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(err){
        console.error(err);
        return null;
    }
}
async function getUserByUsername(username){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Item;
    }catch(err){
        console.error(err);
        return null;
    }
}
async function updateUser(userId, newPassword, newRole) {
    let updateExpression = 'SET';
    let expressionAttributeValues = {};
    
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: userId // Primary key (or partition key) for the user
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: {
            '#password': 'password', // DynamoDB reserved word "password"
            '#role': 'role'          // DynamoDB reserved word "role"
        },
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW' // Return the updated attributes
    };

    try {
        const result = await dynamoDb.update(params).promise();
        console.log('User updated successfully:', result);
        return result.Attributes; // Returning updated user info
    } catch (error) {
        throw new Error('Could not update user.');
    }
}

module.exports = {createUser, getUserById, getUserByUsername, updateUser };