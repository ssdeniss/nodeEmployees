const express = require('express');
const router = express.Router();
const {login, register, current} = require('../controllers/usersController')

router.post('/login', login);
router.post('/register', register);
router.get('/current', current);

module.exports = router;
