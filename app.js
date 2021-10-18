const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/app');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const { login, createUser } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 4000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use(cookieParser());
app.use(cors);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
