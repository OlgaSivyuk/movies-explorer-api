// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const SALT_ROUNDS = 10;

const {
  // CREATED_CODE,
  OK_CODE,
} = require('../constants/errorsCode');

const BadReqError = require('../errors/bad-req-error'); // 400
// const AuthorizationError = require('../errors/authorization-error'); // 401
const NotFoundError = require('../errors/not-found-error'); // 404
// const ConflictError = require('../errors/conflict-error'); // 409

// module.exports.createUser = (req, res, next) => {
//   console.log(req);
//   const {
//     name,
//     email,
//     password,
//   } = req.body;

//   bcrypt.hash(password, SALT_ROUNDS)
//     .then((hash) => User.create({ // console.log(hash); после then
//       name,
//       email,
//       password: hash,
//     }))
//     .then((user) => {
//       // console.log(user);
//       res.status(CREATED_CODE).send({
//         name: user.name,
//         email: user.email,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       if (err.name === 'ValidationError') {
//         next(new BadReqError('Переданы некорректные данные для создания пользователя.'));
//         return;
//       }
//       if (err.name === 'MongoServerError') {
//         next(new ConflictError('Пользователь с таким email уже есть.'));
//         return;
//       }
//       next(err);
//     });
// };

module.exports.getUserMe = (req, res, next) => {
  console.log(req);
  // User.findOne({ _id: req.user._id })
  User.findOne({ _id: req.params.userId }) // проверяю запрос get в postman
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(OK_CODE)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
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
      res.status(OK_CODE).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для обновления пользователя.'));
        return;
      }
      next(err);
    });
};
