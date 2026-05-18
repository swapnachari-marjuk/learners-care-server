const express = require("express");
const router = express.Router();

const { signinUser, loginUser, logoutUser } = require("../controllers/user.controller");

router.post("/", signinUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;
