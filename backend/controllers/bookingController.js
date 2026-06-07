const pool = require('../db');
const { sendOTP, generateOTP } = require('../services/smsService');

const ALLOWED_BARBERS = ['Arman Rezaei', 'Sina Moradi', 'Daniyal Karimi'];
const ALLOWED_SERVICES = ['Haircut', 'Hair Perm', 'Hair Color', 'Groom Package', 'Facial'];
const ALLOWED_TIMES = ['11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

const createBooking = async (req, res) => {
  try {
    const { fullName, phone, date, time, barber, services } = req.body;

    if (!fullName || !phone || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sanitizedName = fullName.trim().slice(0, 100);
    const sanitizedPhone = phone.trim();
    const sanitizedDate = date.trim();
    const sanitizedTime = time.trim();

    // Validate phone
    if (!/^(\+43|0043|0)[1-9][0-9]{3,12}$/.test(sanitizedPhone.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sanitizedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Validate time is one of allowed slots
    if (!ALLOWED_TIMES.includes(sanitizedTime)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    // Validate date is not in the past and not more than 7 days ahead
    const bookingDate = new Date(sanitizedDate);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 7); maxDate.setHours(0,0,0,0);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot book a date in the past' });
    }
    if (bookingDate > maxDate) {
      return res.status(400).json({ message: 'Cannot book more than 7 days in advance' });
    }

    // مشکل ۴ fix: validate barber against whitelist
    if (barber && !ALLOWED_BARBERS.includes(barber)) {
      return res.status(400).json({ message: 'Invalid barber selection' });
    }

    // مشکل ۵ fix: validate services against whitelist
    const servicesArray = Array.isArray(services) ? services : [];
    const invalidServices = servicesArray.filter(s => !ALLOWED_SERVICES.includes(s));
    if (invalidServices.length > 0) {
      return res.status(400).json({ message: 'Invalid service selection' });
    }

    // Check: phone already has active booking
    const existingPhone = await pool.query(
      'SELECT id FROM bookings WHERE phone = $1 AND verified = TRUE',
      [sanitizedPhone]
    );
    if (existingPhone.rows.length > 0) {
      return res.status(409).json({ message: 'This phone number already has an active booking' });
    }

    // Check: time slot already booked for this barber
    const existingSlot = await pool.query(
      'SELECT id FROM bookings WHERE date = $1 AND time = $2 AND barber = $3 AND verified = TRUE',
      [sanitizedDate, sanitizedTime, barber || null]
    );
    if (existingSlot.rows.length > 0) {
      return res.status(409).json({ message: 'This time slot is already booked for the selected barber' });
    }

    // Delete old unverified bookings for this phone
    await pool.query('DELETE FROM bookings WHERE phone = $1 AND verified = FALSE', [sanitizedPhone]);

    const servicesStr = servicesArray.join(',');

    const result = await pool.query(
      'INSERT INTO bookings ("fullName", phone, date, time, barber, services) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [sanitizedName, sanitizedPhone, sanitizedDate, sanitizedTime, barber || null, servicesStr]
    );
    const bookingId = result.rows[0].id;

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      'INSERT INTO otps (phone, code, "bookingId", "expiresAt") VALUES ($1, $2, $3, $4)',
      [sanitizedPhone, code, bookingId, expiresAt]
    );

    sendOTP(sanitizedPhone, code);

    res.status(201).json({ message: 'Verification code sent', bookingId });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBooking };
