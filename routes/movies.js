const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/:modieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteMovie)

module.exports = router;