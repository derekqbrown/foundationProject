const express = require('express');
const app = express();
const userController = require('./controller/userController');
const requestController = require('./controller/requestController');
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
    logger.info(`Server is running on port ${PORT}`)
    console.log(`Server is running on port ${PORT}`);
});