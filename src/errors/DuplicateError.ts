export interface DuplicateError extends Error {
  statusCode: number;
  message: string;
}

export class DuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}
