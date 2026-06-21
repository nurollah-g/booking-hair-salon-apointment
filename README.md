# DS Barbers — Online Appointment Booking System

A full-stack web application for booking barbershop appointments, built with React, Node.js, and PostgreSQL. Supports English and German languages.

---

## Features

- **Barber Selection** — Choose from available barbers with their specialties
- **Service Selection** — Haircut, Hair Perm, Hair Color, Groom Package, Facial
- **OTP Verification** — Phone number verified via SMS before booking is confirmed
- **Booking Dashboard** — Unique secure link sent via SMS to view or cancel booking
- **SMS Notifications** — Confirmation and cancellation messages sent to both customer and barber
- **Bilingual** — Full English and Persian language support
- **Responsive** — Optimized for mobile, tablet, and desktop

---

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Router

**Backend**
- Node.js + Express
- PostgreSQL
- Twilio (SMS)

---

## Project Structure

```
barber/
├── barbershop/          # React frontend
│   ├── src/
│   │   ├── Home.jsx
│   │   ├── SelectionPage.jsx
│   │   ├── BookingForm.jsx
│   │   ├── Auth.jsx
│   │   ├── ReservationDashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── about.jsx
│   │   ├── i18n.js
│   │   └── LanguageContext.js
│   └── package.json
│
└── backend/             # Node.js backend
    ├── controllers/
    │   ├── bookingController.js
    │   └── authController.js
    ├── routes/
    │   ├── booking.js
    │   └── auth.js
    ├── services/
    │   └── smsService.js
    ├── db.js
    ├── server.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Twilio account (for SMS)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=barbershop
PG_USER=postgres
PG_PASSWORD=your_password

SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+43xxxxxxxxx

BARBER_PHONE_ARMAN_REZAEI=+43xxxxxxxxx
BARBER_PHONE_SINA_MORADI=+43xxxxxxxxx
BARBER_PHONE_DANIYAL_KARIMI=+43xxxxxxxxx
BARBER_PHONE=+43xxxxxxxxx

ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE barbershop;
```

Run the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd barbershop
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the app:

```bash
npm start
```

---

## Database Migration

If you already have a `bookings` table, run this in pgAdmin:

```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS barber TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS services TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS token TEXT UNIQUE;
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/booking` | Create a new booking |
| POST | `/api/auth/verify` | Verify OTP code |
| POST | `/api/auth/resend` | Resend OTP code |
| GET | `/api/auth/booking/:token` | Get booking by token |
| DELETE | `/api/auth/booking/:token` | Cancel booking by token |
| DELETE | `/api/auth/cancel/:id` | Cancel booking by ID |

---

## Booking Flow

```
Select Barber & Services
        ↓
  Fill Booking Form
  (Name, Phone, Date, Time)
        ↓
  OTP sent via SMS
        ↓
  Enter OTP to verify
        ↓
  Booking confirmed
  SMS sent to customer + barber
  Unique dashboard link sent via SMS
        ↓
  Customer can view/cancel via link
  Cancel SMS sent to customer + barber
```

---

## Security

- Input validation and sanitization on all endpoints
- Whitelist validation for barbers, services, and time slots
- OTP brute-force protection (max 5 attempts)
- Rate limiting (30 req/15min, 10 req/15min for OTP)
- Helmet.js security headers
- CORS restricted to frontend origin
- Request body size limit (10kb)
- Secure random tokens for booking links

---

## License

MIT

---

## Author

Designed and developed exclusively by **[nurollah-g](https://github.com/nurollah-g)**
