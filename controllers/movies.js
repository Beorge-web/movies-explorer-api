const Movie = require('../models/movie');

const ServerError = require('../errors/server-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch(() => {
    throw new ServerError('Произошла ошибка');
  })
  .catch(next);
const createMovie = (req, res, next) => {
  req.body.owner = req.user._id;
  return Movie.create(req.body)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации');
      } else {
        throw new ServerError('Произошла ошибка');
      }
    })
    .catch(next);
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нет доступа к фильму');
      }
      return Movie.findByIdAndRemove(movieId)
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Нет фильма с таким id'));
      } else if (err.statusCode === 403) {
        next(new ForbiddenError('Нет доступа к фильму'));
      }
      throw new ServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
