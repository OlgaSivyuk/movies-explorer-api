const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateProfile,
  createUser,
} = require('../controllers/users');

router.get('/me', getUserMe);

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateProfile,
);

module.exports = router;
