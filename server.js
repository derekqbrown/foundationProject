const express = require('express');
const app = express();
const mainController = require('./src/controllers/mainController');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', mainController);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});