const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     parseInt(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'barbershop',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      barber TEXT,
      services TEXT,
      token TEXT UNIQUE,
      verified BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      "bookingId" INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      "expiresAt" TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE
    );
  `);
  console.log('Database tables ready');
};

initDB().catch(console.error);

module.exports = pool;
