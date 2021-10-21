const router = require('express').Router();
const { logOut } = require('../controllers/user');

router.post('/signout', logOut);

module.exports = router;
