//import express server
require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDBStore = require('connect-mongo')

// Database connection
mongoose.connect("mongodb://localhost:27017/pizza" , {useNewUrlParser:true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
});

// session store

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDBStore.create({
        mongoUrl: "mongodb://localhost:27017/pizza"
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } // 24 hours
}))

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.json())

// Global middleware
app.use((req,res,next) => {
    res.locals.session = req.session
    next()
})

// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})