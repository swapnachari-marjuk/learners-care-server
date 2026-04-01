const express = require("express");
const router = express.Router();

const { saveCourses } = require("../controllers/course.controller");

router.post("/", saveCourses);

module.exports = router;
