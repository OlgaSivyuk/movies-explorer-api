const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../constants/regex');

const {
  createMovie,
  getMovies,
  deleteMovie,
  getMovieIds,
} = require('../controllers/movies');

router.get('/', getMovies);

router.get('/getmovieids', getMovieIds);

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
      id: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      owner: Joi.string().hex().length(24),
    }),
  }),
  createMovie,
);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
