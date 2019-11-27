const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const parser = require('body-parser');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://' + config.MONGO_USER + ':' + config.MONGO_PASSWORD + '@cluster0-5398r.mongodb.net/' + config.MONGO_DATABASE + '?retryWrites=true&w=majority',{
        useCreateIndex: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() =>{
        console.log('MongoDB Connected!');
    }).catch(err => {
        console.log('MongoDB Failed to connect!');
        console.log(err);
    });

app.use(morgan('dev'));
app.use(favicon('./favicon.ico'));

app.use(parser.json());

// Route Setup
const routeContacts = require('./routes/contacts');

app.use('/contacts', routeContacts);

app.use((req, res, next) => {
    res.status(404).send('404 Page Not Found!');
});

app.use((error, req, res, next)=>{
    console.log(error);
    res.status(500).send('500 Server Error');
});

module.exports = app;
