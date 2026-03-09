// middlewares/logger.js
function requestLogger(req, res, next) {
  const time = new Date().toISOString();

  // Log the method and URL of every incoming request
  console.log(`[${time}]  ${req.method}  ${req.url}`);

  // Always call next() -- without it the request will hang forever
  next();
}

module.exports = requestLogger;
