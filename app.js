require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorsHandler, notFound } = require('./middlewares/errorsHandler');
const allRoutes = require('./routes/index');
const { limiter } = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(require('./middlewares/cors'));

app.use(allRoutes);
app.use(notFound);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.use(limiter);

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
