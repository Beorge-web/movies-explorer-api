const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
module.exports = router;
