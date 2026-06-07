-- Run this query in pgAdmin if you already have a bookings table:
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS barber TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS services TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS token TEXT UNIQUE;
