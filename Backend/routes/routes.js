// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Route definitions
// router.post('/login', userController.login);
// router.post('/signup', userController.signup);
// router.post('/confirm_signup', userController.confirmSignup);
// router.get('/home', userController.home);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {login } = require('../controllers/controller');

// router.post('/signup', signup);

router.post('/login', login);

module.exports = router;