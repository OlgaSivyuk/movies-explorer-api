const allowedCors = [
  // 'https://mesto.project.olgasivyuk.nomoredomains.xyz',
  // 'http://mesto.project.olgasivyuk.nomoredomains.xyz',
  // 'http://api.mesto.olgasivyuk.nomoredomains.xyz',
  // 'https://api.mesto.olgasivyuk.nomoredomains.xyz',
  // 'localhost:3000'
];

module.exports = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('X-Server', 'test');
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});
