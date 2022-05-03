const {getBookings,getBooking,addBooking,updateBooking, deleteBooking} = require('../controllers/bookings')
const express = require('express')
const router = express.Router({mergeParams:true})

const {protect,authorize} = require('../middlewares/auth')

router.route('/').get(protect,getBookings)
      .post(protect,authorize("user"),addBooking)
router.route('/:id').get(protect,getBooking)
      .put(protect,authorize("user","admin"),updateBooking)
      .delete(protect,authorize("user","admin"),deleteBooking)
module.exports = router

