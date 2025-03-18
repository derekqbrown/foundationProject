const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-west-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "UserTickets";

async function postUser(user){
    let userId =`USER#${user.userId}`
    user.userId = userId;
    const userWithSortKey = {
        ...user,        
        sort_key: userId
    };

    const command = new PutCommand({
        TableName,
        Item: userWithSortKey
    });
    try{
        await documentClient.send(command);
        return user;
    }catch(err){
        console.error('Error in postUser:', err);
        return null;
    }
}

async function getUserById(userId){
    const command = new GetCommand({
        TableName,
        Key: {userId}
    });

    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(err){
        console.error('Error in getUserById:', err);
        return null;
    }
}

async function getUserByUsername(username){
    const command = new ScanCommand({
        TableName: TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
    });

    try {
        const data = await documentClient.send(command);

        if (data.Items.length === 0) {
            return null;
        }
        return data.Items[0];  
    } catch (err) {
        console.error('Error in getUserByUsername:', err);
        return null;
    }
}

async function updatePassword(userId, newPassword, user) {

    try {
        let 
        const command = new PutCommand({
            TableName,
            Item: {
                user_id: userId,  
                username: user.username,
                password: newPassword,
                role: user.role,
                sort_key: userId
            }
        });
        await documentClient.send(command);
        return results.Item; 
    } catch (err) {
        console.error('Error in updatePassword:', err);
        return null;
    }
}

async function updateRole(userId, newRole, user) {
    try {
        const command = new PutCommand({
            TableName,
            Item: {
                user_id: userId, 
                username: user.username,
                password: user.password,
                role: newRole,
                sort_key: userId
            }
        });
        const results = await documentClient.send(command);
        return results.Item; 
    } catch (err) {
        console.error('Error in updateRole:', err);
        return null;
    }
}

module.exports = {postUser, getUserById, getUserByUsername, updatePassword, updateRole };