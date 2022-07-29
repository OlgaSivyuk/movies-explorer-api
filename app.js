// require('dotenv').config(); // ПР15

// console.log(process.env.NODE_ENV); // production

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorsHandler, notFound } = require('./middlewares/errorsHandler');
const allRoutes = require('./routes/all-routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(cookieParser());
app.use(bodyParser.json()); // просматриваем запросы со строками и другими типами данных
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов
app.use(require('./middlewares/cors')); // подключаем cors

app.use(allRoutes);
// обработка несуществующего роута
// const NotFoundError = require('./errors/not-found-error'); // 404
// app.use((req, res, next) => {
//   next(new NotFoundError('Страница не существует.'));
// });
app.use(notFound);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorsHandler);
// app.use((err, req, res, next) => {
//   console.log(err);

//   if (err.statusCode) {
//     res.status(err.statusCode).send({ message: err.message });
//     return;
//   }
//   console.error(err.stack);
//   res.status(500).send({ message: 'Ошибка на сервере' });
//   next(); // вызываем next чтобы линтер не ругался на неиспользуемый параметр
// });
app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
