/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ServerError = require('../errors/server-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;
const getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Нет пользователя с таким id'));
    } else res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Введены некорректные данные');
    } else {
      throw new ServerError('Произошла ошибка');
    }
  })
  .catch(next);
const updateUser = (req, res, next) => User.findByIdAndUpdate(req.user._id, req.body, {
  new: true,
  runValidators: true,
})
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Нет пользователя с таким id'));
    } else res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Введены некорректные данные');
    } else if (err.name === 'ValidationError') {
      throw new BadRequestError('Ошибка валидации');
    } else {
      throw new ServerError('Произошла ошибка');
    }
  })
  .catch(next);

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).then((user) => {
    if (user) {
      const err = new ConflictError('Такой пользователь уже существует');
      next(err);
    }
    return bcrypt
      .hash(password, SALT_ROUNDS)
      .then((hash) => {
        req.body.password = hash;
        return User.create(req.body)
          .then((newUser) => {
            const { name, email } = newUser;
            res.status(200).send({
              data: { name, email },
            });
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Ошибка валидации');
        } else throw new ServerError(err.message);
      })
      .catch(next);
  });
};
const logIn = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { name, email } = user;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(201).send({ name, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации');
      } else throw new UnauthorizedError('Неавторизованно');
    })
    .catch(next);
};
const logOut = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.clearCookie('jwt');
      res.status(200).send(user);
    })
    .catch((err) => { throw new ServerError(err.message); })
    .catch(next);
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  logIn,
  logOut,
};
