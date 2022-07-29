const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  console.log('is authorized');
  const token = req.cookies.jwt;
  console.log('auth', token);

  if (!token) {
    next(new AuthorizationError('Нужно авторизоваться для доступа.'));
    return;
  }

  let payload;

  console.log('token', token);

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Нужно авторизоваться для доступа.'));
    return;
  }
  console.log(payload);
  req.user = payload;
  next();
};
