const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone:     { type: String, required: true },
  code:      { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  expiresAt: { type: Date, required: true },
  used:      { type: Boolean, default: false }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
