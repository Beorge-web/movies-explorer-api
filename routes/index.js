const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const authorization = require('./authorization');
const auth = require('../middlewares/auth');
const logOut = require('./logout');
const notFound = require('./notfound');

router.use(authorization);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use(logOut);
router.use(notFound);
module.exports = router;
