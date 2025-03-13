const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authenticateJWT = require('./util/authJWT');

router.post('/tickets', async (req, res) => {
    const { author, description, type="Other", status="Pending", amount } = req.body;
    if (!description || !amount) {
        return res.status(400).json({ message: 'Author and amount are required.' });
    }
    //this is where we send it to service
    
    return res.status(201).json({ message: 'Ticket submitted successfully', ticket: newTicket });
});

router.get('/tickets', async (req, res) => {
    
    const userId = req.user.userId;
    try {
        const tickets = await getTicketsByUser(userId); // Placeholder for service call

        return res.status(201).json({
            message: 'Tickets retrieved successfully',
            tickets,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }

});

router.get('/tickets?status=Pending', async (req, res) => {
    //try to retrieve from database / call service to fetch data

    if (!author) {
        return res.status(400).json({ message: 'Author is required.' });
    }
    return res.status(201).json({ message: 'Tickets retrieved successfully',  });
});




module.exports = router;