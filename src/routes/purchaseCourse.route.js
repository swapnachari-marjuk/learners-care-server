const express = require("express");
const router = express.Router();
const { enrollCourse } = require("../controllers/purchaseCourse.controller");

router.post("/", enrollCourse);

module.exports = router;
