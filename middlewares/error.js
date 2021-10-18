module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode === 500 ? statusCode : err.statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  // eslint-disable-next-line no-console
  console.log(message);
  next();
};
