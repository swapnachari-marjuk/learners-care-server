const express = require("express");
const router = express.Router();

const {
  saveCourses,
  getCourses,
  getSingleCourse,
} = require("../controllers/course.controller");

router.post("/", saveCourses);
router.get("/", getCourses);
router.get("/:id", getSingleCourse);

module.exports = router;
