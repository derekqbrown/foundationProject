const express = require('express');
const router = express.Router();
const userController = require('./userController');
//const requestController = require('./requestController');

router.use('/login', userController);
router.use('/register', userController);
//router.use('/requests', requestController);

module.exports = router;