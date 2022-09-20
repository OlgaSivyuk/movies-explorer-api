const Movie = require('../models/movie');

const BadReqError = require('../errors/bad-req-error'); // 400
const ForbiddenError = require('../errors/forbiden-error'); // 403
const NotFoundError = require('../errors/not-found-error'); // 404

module.exports.createMovie = (req, res, next) => {
  const currentUserId = req.user._id;
  const {
    country, director,
    year, description,
    nameRU, nameEN,
    image, trailerLink, thumbnail,
    id, duration,
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
    id,
    owner: currentUserId,
  })
    // .then((movie) => res.send({ data: movie }))
    .then(() => res.send({ data: { success: true } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError(err));
        return;
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  const currentUser = req.user._id;
  Movie.find({ owner: currentUser })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.getMovieIds = (req, res, next) => {
  const currentUser = req.user._id;
  Movie.find({ owner: currentUser })
    .then((movies) => {
      const movieIds = movies.map((movie) => movie.id);
      res.send({ data: movieIds });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user._id;
  Movie.findOne({ id, owner: currentUser })
    .orFail(() => {
      throw new NotFoundError(`Фильм с таким id:${id} не найден.`);
    })
    .then((movie) => {
      // if (currentUser !== movie.owner._id.toString()) {
      if (currentUser !== movie.owner.toString()) {
        throw new ForbiddenError('Недостаточно прав для удаления фильма.');
      }
      return Movie.findByIdAndRemove(movie._id);
    })
    .then(() => {
      res.send({ message: `Фильм с id:${id} удален.` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления фильма.')); // err
        return;
      }
      next(err);
    });
};
