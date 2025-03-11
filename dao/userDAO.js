const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-west-2"});

const documentClient = DynamoDBDocumentClient.from(client);

async function createUser(user){
    const command = new PutCommand({
        TableName: 'Users',
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

async function getUser(user_id){
    const command = new GetCommand({
        TableName: "Users",
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

async function deleteUser(user_id){
    const command = new DeleteCommand({
        TableName: "Users",
        Key: {user_id}
    });

    try{
        await documentClient.send(command);
        return user_id;
    }catch(err){
        console.error(err);
        return null;
    }
}


module.exports = {createUser, getUser, deleteUser};