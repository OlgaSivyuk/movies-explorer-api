const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../constants/regex');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regexUrl),
      trailerLink: Joi.string().required().pattern(regexUrl),
      thumbnail: Joi.string().required().pattern(regexUrl),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      owner: Joi.string().hex().length(24),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
