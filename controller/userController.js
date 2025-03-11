const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
    const { username, password, role = 'EMPLOYEE' } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const existingUser = userService.getUser(username);
    if (existingUser.user) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    const newUser = { username, password, role };

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

router.get('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const existingUser = userService.getUser(username);
    if (!existingUser.user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (existingUser.user.password !== password){
        return res.status(400).json({ message: 'Invalid password.' });
    }

    return res.status(201).json({ message: 'User registered successfully', user: existingUser.user });
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;