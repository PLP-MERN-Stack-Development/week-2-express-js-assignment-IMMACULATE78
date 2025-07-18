class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 400;
  }
}

module.exports = { NotFoundError, ValidationError };
