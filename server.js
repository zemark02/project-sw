const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')

dotenv.config({path:'./config/config.env'})

connectDB();
const app = express()
app.use(cookieParser());

const hotels = require('./routes/hotels.js');
const auths = require('./routes/auth')
const bookings = require('./routes/bookings')

//Body paarser
app.use(express.json())
app.use('/api/v1/hotels',hotels)
app.use('/api/v1/auth',auths)
app.use('/api/v1/bookings',bookings)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT ,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})

process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error : ${err.message}`);
    server.close(()=>process.exit(1));
})

