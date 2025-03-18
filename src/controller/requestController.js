const express = require('express');
const router = express.Router();
const requestService = require('../service/requestService');


router.post('/tickets', async (req, res) => {
    const { author, description, type="Other", amount } = req.body;
    if (!description || !amount) {
        return res.status(400).json({ message: 'Author and amount are required.' });
    }
    const status = "Pending";
    const newTicket = { author, description, type, status, amount }
    let data = await requestService.createTicket(newTicket);
    
    return res.status(201).json({ message: data.message, ticket: newTicket });
});

router.get('/tickets', async (req, res) => {
    
    const userId = req.user.userId;

    const data = await getTicketsByUserId(userId); 

    return res.status(200).json({message: data.message, tickets:data.tickets});
});

router.get('/tickets?status=:status', async (req, res) => {
    const author = req.user.user_id;
    const status = req.params.status; 
    if (!author) {
        return res.status(400).json({ message: 'Author is required.' });
    }

    const data = await requestService.getTicketsByStatus(ticket, status);

    return res.status(200).json({ message: data.message  });
});

router.put('/tickets/update', async (req, res) => {
    const {ticket_id, status } = req.body;
    const updateTicket = requestService.getTicketById(ticket_id);

    if (!description || !amount) {
        return res.status(400).json({ message: 'Author and amount are required.' });
    }
    if(status != "APPROVED" && status != "DENIED"){
        return res.status(400).json({ message: 'Invalid request' });

    }
    const newTicket = { author, description, type, status, amount }
    let data = await requestService.updateTicketStatus(newTicket);
    
    return res.status(data.code).json({ message: data.message, ticket: newTicket });
});

module.exports = router;