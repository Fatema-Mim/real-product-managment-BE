export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class DatabaseError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = 500;
  }
}
