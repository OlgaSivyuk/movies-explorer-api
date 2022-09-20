const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

const {
  CREATED_CODE,
} = require('../constants/statusCode');

const BadReqError = require('../errors/bad-req-error'); // 400
const AuthorizationError = require('../errors/authorization-error'); // 401
const NotFoundError = require('../errors/not-found-error'); // 404
const ConflictError = require('../errors/conflict-error'); // 409

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      console.log(hash);
      return User.create({
        name,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res.status(CREATED_CODE).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для создания пользователя.'));
        return;
      }
      if (err.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с таким email уже есть.'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные email или пароль (проверка юзера).');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Неправильные email или пароль (проверка хеша).');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
          res.send({ _id: user._id, email: user.email });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для запроса пользователя (куки).'));
        return;
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден.');
    })
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для обновления пользователя.'));
        return;
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже есть.'));
        return;
      }
      next(err);
    });
};
