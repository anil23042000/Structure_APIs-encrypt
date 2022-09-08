require('./Config/db');

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');




const userController = require('./Routes/userController');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(4005, () => {
    console.log('Express server started at port : 4005');
});

app.use('/user', userController);