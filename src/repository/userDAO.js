const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-west-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "UserTickets";

async function postUser(user){
    user.user_id = `USER#${user.user_id}`;
    const userWithSortKey = {
        ...user,        
        sort_key: user.user_id
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

async function getUserById(user_id){
    const command = new GetCommand({
        TableName,
        Key: {user_id, sort_key:user_id}
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

async function updatePassword(user_id, newPassword, user) {
    const updatedUser = {
        user_id: user_id,  
        username: user.username,
        password: newPassword,
        role: user.role,
        sort_key: user_id
    }
    try {
        const command = new PutCommand({
            TableName,
            Item: updatedUser
        });
        const data = await documentClient.send(command);
        if(data){return updatedUser;}
        return null;
    } catch (err) {
        console.error('Error in updatePassword:', err);
        return null;
    }
}

async function updateRole(newRole, user) {
    try {
        const command = new PutCommand({
            TableName,
            Item: {
                user_id: user.userId, 
                username: user.username,
                password: user.password,
                role: newRole,
                sort_key: user.userId
            }
        });
        const data = await documentClient.send(command);
        return data.Item; 
    } catch (err) {
        console.error('Error in updateRole:', err);
        return null;
    }
}

module.exports = {postUser, getUserById, getUserByUsername, updatePassword, updateRole };