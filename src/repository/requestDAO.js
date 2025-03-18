const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-west-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "UserTickets";

async function postTicket(ticket){
    const ticketWithSortKey = {
        ...ticket,        
        sort_key: ticket.ticket_id 
    };

    const command = new PutCommand({
        TableName,
        Item: ticketWithSortKey
    });
    try{
        await documentClient.send(command);
        return ticket;
    }catch(err){
        console.error('Error in postTicket:', err);
        return null;
    }
}

async function getTicketsByUserId(userId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: 'PK = :user_id and begins_with(sort_key, :ticket_prefix)',
        ExpressionAttributeValues: {
            ':user_id': `USER#${userId}`, 
            ':ticket_prefix': 'TICKET#'    
        }
    });

    try {
        const { Items } = await documentClient.send(command);
        return Items;  
    } catch (err) {
        console.error('Error in getTicketsByUserId:', err);
        return null;
    }
}

async function getTicketsByStatus(status) {
    const command = new QueryCommand({
        TableName,
        IndexName: 'StatusIndex',  
        KeyConditionExpression: 'status = :status',
        ExpressionAttributeValues: {
            ':status': status
        }
    });

    try {
        const { Items } = await documentClient.send(command);
        return Items;  
    } catch (err) {
        console.error('Error in getTicketsByStatus:', err);
        return null;
    }
}

async function updateTicketStatus(ticket) {

    try {
        const command = new PutCommand({
            TableName,
            Item: {
                ...ticket,
                sort_key: `TICKET#${ticket.ticket_id}`
            }
        });
        await documentClient.send(command);
        return ticket; 
    } catch (err) {
        console.error('Error in updateTicketStatus:', err);
        return null;
    }
}
async function getTicketById(userId, ticketId){
    const command = new GetCommand({
        TableName,
        Key: {
            user_id: userId,
            sort_key: `TICKET#${ticketId}`
        }
    });

    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(err){
        console.error('Error in getUserById:', err);
        return null;
    }
}


module.exports = {postTicket, getTicketsByUserId, getTicketsByStatus, getTicketById, updateTicketStatus };