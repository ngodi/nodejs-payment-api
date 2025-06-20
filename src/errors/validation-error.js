import HTTP_STATUS from 'http-status-codes';

export class ValidationError extends Error {
  statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
  status = 'error';

  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }

  serializeErrors() {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      errors:
        this.errors?.array?.().map((error) => ({
          field: error.path,
          message: error.msg,
        })) || [],
    };
  }
}
