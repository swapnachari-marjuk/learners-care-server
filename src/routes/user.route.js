const express = require("express");
const router = express.Router();

const { saveUser, loginUser } = require("../controllers/user.controller");

router.post("/", saveUser);
router.post("/login", loginUser);
module.exports = router;
