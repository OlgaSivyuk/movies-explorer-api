const Movie = require('../models/movie');

const {
  OK_CODE,
} = require('../constants/statusCode');

const BadReqError = require('../errors/bad-req-error'); // 400
const ForbiddenError = require('../errors/forbiden-error'); // 403
const NotFoundError = require('../errors/not-found-error'); // 404

module.exports.createMovie = (req, res, next) => {
  // console.log(req.body);
  const currentUser = req.user._id;
  const {
    country, director, duration,
    year, description,
    nameRU, nameEN, movieId,
    image, trailerLink, thumbnail,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: currentUser,
  })
    .then((movie) => res.status(OK_CODE)
      .send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // next(new BadReqError('Переданы некорректные данные для создания фильма.'));
        next(new BadReqError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        return;
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  // console.log('проверка получить фильмы', req.body);
  const currentUser = req.user._id;
  Movie.find({ owner: currentUser })
    .then((movie) => res.status(OK_CODE).send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  // console.log('проверка удалить фильмы', req.body);
  const { _id } = req.params;
  const currentUser = req.user._id;
  Movie.findById(_id)
    .orFail(() => {
      throw new NotFoundError(`Фильм с таким id:${_id} не найден.`);
    })
    .then((movie) => {
      // console.log('проверка owner фильмы удаление', movie.owner._id);
      // if (currentUser !== movie.owner._id.toString()) {
      if (currentUser !== movie.owner.toString()) {
        throw new ForbiddenError('Недостаточно прав для удаления фильма.');
      }
      return Movie.findByIdAndRemove(_id);
    })
    .then(() => {
      res.status(OK_CODE).send({ message: `Фильм с id:${_id} удален.` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления фильма.'));
        return;
      }
      next(err);
    });
};
