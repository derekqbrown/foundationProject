const userDao = require("../repository/requestDAO");
const { v4: uuidv4 } = require('uuid');
const logger = require("../util/logger");

async function createTicket(ticket){
    let userId = req.user.user_id;

    if(description.length < 1 || amount <= 0){
        return {code:400, message: "Description and amount are required"};
    }

    const ticketId = `TICKET#${uuidv4()}`;

    const newTicket = {
        ticket_id: ticketId,
        user_id: userId,
        description,
        amount,
        type: ticket.type || 'Other',
        sort_key:  ticketId,
        created:  new Date()
    };

    const result = await requestDao.postTicket(newTicket);
    if(!result){
        logger.error("Failed to submit ticket")
        return {code:400, message: "Failed to submit ticket"};
    }else{
        logger.info("Ticket submitted", result);
        return {code:201, message: "Ticket submitted", user: result};
    }
}

async function getTicketsByUserId(userId){
    const result = await requestDao.getTicketsByUserId(userId);
    if(!result){
        logger.error("Failed to get tickets")
        return {code:400, message: "Failed to get tickets"};
    }else{
        logger.info("Tickets retrieved", result);
        return {code:200, message: "Tickets retrieved", tickets: result};
    }
}

async function getTicketsByStatus(status){
    const result = await requestDao.getTicketsByStatus(status);
    if(!result){
        logger.error("Failed to get tickets")
        return {code:400, message: "Failed to get tickets"};
    }else{
        logger.info("Tickets retrieved", result);
        return {code:200, message: "Tickets retrieved", tickets: result};
    }
}

async function updateTicketStatus(ticket, status){
    const result = await requestDao.updateTicketStatus(ticket, status);
    if(!result){
        logger.error("Failed to update ticket")
        return {code:400, message: "Failed to update ticket"};
    }else{
        logger.info("Ticket status updated", result);
        return {code:200, message: "Ticket status updated", ticket: result};
    }
}

async function getTicketById(ticket_id){
    const result = await requestDao.getTicketById(ticket_id);
    if(!result){
        logger.error("Failed to get ticket")
        return {code:400, message: "Failed to get ticket"};
    }else{
        logger.info("Ticket retrieved", result);
        return {code:200, message: "Ticket retrieved", tickets: result};
    }
}

module.exports = {createTicket, getTicketsByUserId, getTicketsByStatus, updateTicketStatus, getTicketById }