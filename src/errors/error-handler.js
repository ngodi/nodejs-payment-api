import HTTP_STATUS from 'http-status-codes';

export class CustomError extends Error {
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

//badRequest error

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';

  constructor(message) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message) {
    super(message);
  }
}