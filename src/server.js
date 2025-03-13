const express = require('express');
const app = express();
const userController = require('./src/controllers/userController');
const requestController = require('./src/controllers/requestController');
const logger = require('./util/logger');

const PORT = process.env.PORT || 3000;

function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

app.use(express.json());
app.use(loggerMiddleware);

app.use('/login', userController);
app.use('/register', userController);
app.use('/tickets', requestController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});