const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

require("./db");

const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");

const app = express();

app.set("trust proxy", 1);

// Security headers
app.use(helmet());
app.disable("x-powered-by");

// CORS
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:3000"
).split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body size limit
app.use(express.json({ limit: "10kb" }));

// Rate limiting - max 30 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter limit for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later." },
});
app.use("/api/auth/verify", otpLimiter);
app.use("/api/auth/resend", otpLimiter);

app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
