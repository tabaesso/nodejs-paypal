const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.listen(3000, () => console.log('Rodando na porta 3000'));