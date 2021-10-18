const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
