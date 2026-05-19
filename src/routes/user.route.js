const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  logoutUser,
  refreshToken,
} = require("../controllers/user.controller");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
module.exports = router;
