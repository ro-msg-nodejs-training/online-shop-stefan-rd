class HttpError extends Error {
  constructor(message = "default message", status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = "HttpError";
    this.message = message;
    this.status = status;
    this.date = new Date();
  }
}

module.exports = HttpError;
