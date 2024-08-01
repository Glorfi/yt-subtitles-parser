export interface NotFound extends Error {
  statusCode: number;
  message: string;
}

export class NotFound extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
