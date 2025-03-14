const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");

const client = new DynamoDBClient({region: "us-west-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Users";

async function createUser(user){

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

async function updatePassword(userId, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const params = {
            TableName,
            Key: {
                user_id: userId 
            },
            UpdateExpression: 'SET #password = :password',
            ExpressionAttributeNames: {
                '#password': 'password' 
            },
            ExpressionAttributeValues: {
                ':password': hashedPassword 
            },
            ReturnValues: 'ALL_NEW' 
        };

        const result = await dynamoDb.update(params).promise();
        return result.Attributes; 
    } catch (error) {
        return null;
    }
}

async function updateRole(userId, newRole) {
    try {
        const params = {
            TableName,
            Key: {
                user_id: userId 
            },
            UpdateExpression: 'SET #role = :role',
            ExpressionAttributeNames: {
                '#role': 'role' 
            },
            ExpressionAttributeValues: {
                ':role': newRole 
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDb.update(params).promise();
        logger.info('Role updated: ', result);
        return result.Attributes; 
    } catch (error) {
        return null;
    }
}

module.exports = {createUser, getUserById, getUserByUsername, updatePassword, updateRole };