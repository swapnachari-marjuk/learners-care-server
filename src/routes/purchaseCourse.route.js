const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  checkEnrollment,
} = require("../controllers/purchaseCourse.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");

router.post("/", enrollCourse);
router.get("/:email", verifyJWT, getMyCourses);
router.get("/", checkEnrollment);

module.exports = router;
