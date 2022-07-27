const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
// , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('mongoDB connection sucsessfull');
//   }).catch(() => {
//     console.log('mongoDB connection error');
//   });

// пути роутинга
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
