const express = require('express');
const router = express.Router();

const { saveUser } = require('../controllers/user.controller');

router.post('/', saveUser);

module.exports = router;