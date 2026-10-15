import { STATUS_CODES } from "node:http";

function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode < 500
        ? err.message
        : STATUS_CODES[500],
  });
}

export default errorMiddleware;