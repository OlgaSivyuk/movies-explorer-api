const NotFoundError = require('../errors/not-found-error'); // 404

const errorsHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: 'Ошибка на сервере' });
  next();
};

const notFound = (req, res, next) => {
  next(new NotFoundError('Страница не существует.'));
};

module.exports = {
  errorsHandler,
  notFound,
};
