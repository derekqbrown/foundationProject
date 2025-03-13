const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
    const { username, password, role = 'EMPLOYEE' } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const existingUser = userService.getUserByUsername(username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    const newUser = { username, password, role };
    userService.createUser(newUser);

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const data = await userService.loginUser(username, password);
    if(data){
        res.status(200).json({message: "You have logged in!", data: token});
    }else{
        res.status(401).json({message: "Invalid login"});
    }
})

router.put('/user', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || (!password && !role)) {
        return res.status(400).json({ message: 'Invalid request.' });
    }

    const existingUser = userService.getUserByUsername(username);
    if (!existingUser.user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const data = userService.updateUser(existingUser.user.userId,)

    return res.status(201).json({ message: 'User updated successfully', user: data.user });
});

module.exports = router;