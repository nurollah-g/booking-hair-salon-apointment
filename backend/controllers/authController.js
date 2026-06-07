const pool = require("../db");
const crypto = require("crypto");
const { sendOTP, generateOTP, sendSMS } = require("../services/smsService");

const failedAttempts = new Map();

const generateToken = () => crypto.randomBytes(6).toString("hex");

const verifyOTP = async (req, res) => {
  try {
    const { phone, code, bookingId } = req.body;

    if (!phone || !code || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!/^(\+43|0043|0)[1-9][0-9]{3,12}$/.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: "Invalid code format" });
    }
    const parsedBookingId = parseInt(bookingId);
    if (isNaN(parsedBookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    // Brute-force protection
    const attemptKey = `${phone}:${parsedBookingId}`;
    const attempts = failedAttempts.get(attemptKey) || 0;
    if (attempts >= 5) {
      return res
        .status(429)
        .json({
          message: "Too many failed attempts. Please request a new code.",
        });
    }

    const otpResult = await pool.query(
      `SELECT * FROM otps 
       WHERE phone = $1 AND code = $2 AND "bookingId" = $3 AND used = FALSE AND "expiresAt" > NOW()`,
      [phone, code, parsedBookingId],
    );

    if (otpResult.rows.length === 0) {
      failedAttempts.set(attemptKey, attempts + 1);
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    failedAttempts.delete(attemptKey);

    const otp = otpResult.rows[0];

    // Generate secure token for dashboard link
    const token = generateToken();

    await pool.query("UPDATE otps SET used = TRUE WHERE id = $1", [otp.id]);
    await pool.query(
      "UPDATE bookings SET verified = TRUE, token = $1 WHERE id = $2",
      [token, parsedBookingId],
    );

    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [parsedBookingId],
    );
    const booking = bookingResult.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const servicesList = booking.services
      ? booking.services.split(",").filter(Boolean)
      : [];
    const servicesDisplay =
      servicesList.length > 0 ? servicesList.join(", ") : "Not specified";

    // Dashboard link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const dashboardLink = `${frontendUrl}/booking/${token}`;

    // SMS to customer - includes dashboard link
    const customerMsg = [
      "Your appointment is confirmed! ✅",
      `Name: ${booking.fullName}`,
      `Date: ${booking.date}`,
      `Time: ${booking.time}`,
      booking.barber ? `Barber: ${booking.barber}` : "",
      `Services: ${servicesDisplay}`,
      "",
      "View or cancel your booking:",
      dashboardLink,
    ]
      .filter((s) => s !== undefined)
      .join("\n");
    await sendSMS(booking.phone, customerMsg);

    // SMS to specific barber
    const barberEnvKey = booking.barber
      ? `BARBER_PHONE_${booking.barber.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`
      : null;
    const barberPhone = barberEnvKey
      ? process.env[barberEnvKey] || process.env.BARBER_PHONE
      : process.env.BARBER_PHONE;

    if (barberPhone) {
      const barberMsg = [
        "New appointment booked! 💈",
        `Name: ${booking.fullName}`,
        `Phone: ${booking.phone}`,
        `Date: ${booking.date}`,
        `Time: ${booking.time}`,
        `Services: ${servicesDisplay}`,
      ].join("\n");
      await sendSMS(barberPhone, barberMsg);
    }

    res.status(200).json({
      message: "Booking confirmed successfully",
      token,
      booking: {
        id: booking.id,
        fullName: booking.fullName,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        barber: booking.barber || null,
        services: servicesList,
        submittedAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { phone, bookingId } = req.body;

    if (!phone || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!/^(\+43|0043|0)[1-9][0-9]{3,12}$/.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    const parsedBookingId = parseInt(bookingId);
    if (isNaN(parsedBookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const bookingCheck = await pool.query(
      "SELECT id FROM bookings WHERE id = $1 AND phone = $2 AND verified = FALSE",
      [parsedBookingId, phone],
    );
    if (bookingCheck.rows.length === 0) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const resendCount = await pool.query(
      'SELECT COUNT(*) FROM otps WHERE "bookingId" = $1',
      [parsedBookingId],
    );
    if (parseInt(resendCount.rows[0].count) >= 5) {
      return res
        .status(429)
        .json({ message: "Too many code requests. Please try again later." });
    }

    await pool.query(
      'UPDATE otps SET used = TRUE WHERE phone = $1 AND "bookingId" = $2',
      [phone, parsedBookingId],
    );

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      'INSERT INTO otps (phone, code, "bookingId", "expiresAt") VALUES ($1, $2, $3, $4)',
      [phone, code, parsedBookingId, expiresAt],
    );

    await sendOTP(phone, code);

    res.status(200).json({ message: "New code sent" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const result = await pool.query("SELECT id FROM bookings WHERE id = $1", [
      bookingId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await pool.query("DELETE FROM bookings WHERE id = $1", [bookingId]);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/booking/:token  - load booking by token
const getBookingByToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || !/^[a-f0-9]{12}$/.test(token)) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const result = await pool.query(
      "SELECT * FROM bookings WHERE token = $1 AND verified = TRUE",
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result.rows[0];
    const servicesList = booking.services
      ? booking.services.split(",").filter(Boolean)
      : [];

    res.status(200).json({
      booking: {
        id: booking.id,
        fullName: booking.fullName,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        barber: booking.barber || null,
        services: servicesList,
        submittedAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/auth/booking/:token  - cancel booking by token
const cancelBookingByToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || !/^[a-f0-9]{12}$/.test(token)) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const result = await pool.query(
      "SELECT * FROM bookings WHERE token = $1 AND verified = TRUE",
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result.rows[0];
    const servicesList = booking.services
      ? booking.services.split(",").filter(Boolean)
      : [];
    const servicesDisplay =
      servicesList.length > 0 ? servicesList.join(", ") : "Not specified";

    await pool.query("DELETE FROM bookings WHERE token = $1", [token]);

    // SMS to customer
    const customerCancelMsg = [
      "Your appointment has been cancelled. ❌",
      `Name: ${booking.fullName}`,
      `Date: ${booking.date}`,
      `Time: ${booking.time}`,
      booking.barber ? `Barber: ${booking.barber}` : "",
      "If this was a mistake, please book again on our website.",
    ]
      .filter(Boolean)
      .join("\n");
    await sendSMS(booking.phone, customerCancelMsg);

    // SMS to barber
    const barberEnvKey = booking.barber
      ? `BARBER_PHONE_${booking.barber.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`
      : null;
    const barberPhone = barberEnvKey
      ? process.env[barberEnvKey] || process.env.BARBER_PHONE
      : process.env.BARBER_PHONE;

    if (barberPhone) {
      const barberCancelMsg = [
        "Appointment cancelled! ❌",
        `Name: ${booking.fullName}`,
        `Phone: ${booking.phone}`,
        `Date: ${booking.date}`,
        `Time: ${booking.time}`,
        `Services: ${servicesDisplay}`,
      ].join("\n");
      await sendSMS(barberPhone, barberCancelMsg);
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel by token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  verifyOTP,
  resendOTP,
  cancelBooking,
  getBookingByToken,
  cancelBookingByToken,
};
