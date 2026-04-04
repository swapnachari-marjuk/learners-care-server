const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  checkEnrollment,
} = require("../controllers/purchaseCourse.controller");

router.post("/", enrollCourse);
router.get("/:email", getMyCourses);
router.get("/", checkEnrollment);

module.exports = router;
