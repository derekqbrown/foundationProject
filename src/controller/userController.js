const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

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
    let data = userService.createUser(newUser);

    return res.status(201).json({ message: data.message, user:data.user });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const data = await userService.loginUser(username, password);
    if(data.token){
        res.status(200).json({message: data.message, data: token});
    }else{
        if(data.message === "User not found"){
            res.status(404).json({message: data.message})
        }
        res.status(401).json({message: data.message});
    }
})

router.put('/user', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || (!password && !role)) {
        return res.status(400).json({ message: 'Invalid request.' });
    }

    const existingUser = userService.getUserByUsername(username).user;
    if (!existingUser) {
        return res.status(404).json({ message: existingUser.message });
    }

    const data = userService.updateUser(existingUser.userId, password, role);
    if(data.user){
        logger.info(data.message, data.user);
        return res.status(201).json({ message:data.message, user: data.user });
    }
    return res.status(201).json({ message:data.message, user: data.user });
});

module.exports = router;