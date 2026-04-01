const express = require("express");
const router = express.Router();

const {
  saveCourses,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

router.post("/", saveCourses);
router.get("/", getCourses);
router.get("/:id", getSingleCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);
module.exports = router;
