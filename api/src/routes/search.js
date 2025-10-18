const express = require("express");
const { searchEvents } = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchEvents);

module.exports = router;
