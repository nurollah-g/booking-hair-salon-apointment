const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");

router.options("/", (req, res) => res.sendStatus(200));
router.post("/", createBooking);

module.exports = router;
