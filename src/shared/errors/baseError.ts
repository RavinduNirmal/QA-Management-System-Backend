import { StatusCodes } from "../constants/statusCodes";

export default class BaseError extends Error {
  public statusCode: number;
  public desc: string;
  constructor(httpStatusCode: number, description: string) {
    super(description);
    this.statusCode = httpStatusCode;
    this.desc = description;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  getStatusCode() {
    return this.statusCode;
  }
}

export class BadRequest extends BaseError {
  constructor(description: string) {
    super(StatusCodes.BAD_REQUEST, description);
  }
}

export class Conflict extends BaseError {
  constructor(description: string) {
    super(StatusCodes.CONFLICT, description);
  }
}

export class NotFound extends BaseError {
  constructor(description: string) {
    super(StatusCodes.NOT_FOUND, description);
  }
}

export class SQLError extends BaseError {
  constructor(description: string) {
    super(StatusCodes.CONFLICT, description);
  }
}

export class Forbidden extends BaseError {
  constructor(description: string) {
    super(StatusCodes.FORBIDDEN, description);
  }
}

export class NotAllowed extends BaseError {
  constructor(description: string) {
    super(StatusCodes.NOT_ALLOWED, description);
  }
}

export class NotAuthorized extends BaseError {
  constructor(description: string) {
    super(StatusCodes.NOT_AUTHORIZED, description);
  }
}

export class ServerError extends BaseError {
  constructor(description: string) {
    super(StatusCodes.SERVER_ERROR, description);
  }
}
