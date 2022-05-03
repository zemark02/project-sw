const express = require('express')
const router = express.Router();
const controller = require('../controllers/hotels')
const {protect,authorize} = require('../middlewares/auth')
const bookingRouter = require('./bookings')


router.use('/:hotelId/bookings',bookingRouter)

router.route('/').get(controller.getHotels)


router.route('/:id').get(controller.getHotel)


module.exports = router

