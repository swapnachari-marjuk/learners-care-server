const express = require("express");
const router = express.Router();

const { saveCourses, getCourses } = require("../controllers/course.controller");

router.post("/", saveCourses);
router.get("/", getCourses);
module.exports = router;
