export interface BadRequest extends Error {
  statusCode: number;
  message: string;
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
