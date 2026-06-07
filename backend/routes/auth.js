const express = require('express');
const router = express.Router();
const {
  verifyOTP,
  resendOTP,
  cancelBooking,
  getBookingByToken,
  cancelBookingByToken
} = require('../controllers/authController');

router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);
router.delete('/cancel/:bookingId', cancelBooking);
router.get('/booking/:token', getBookingByToken);
router.delete('/booking/:token', cancelBookingByToken);

module.exports = router;
