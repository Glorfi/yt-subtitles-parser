export interface UnauthorizedAccess extends Error {
  statusCode: number;
  message: string;
}

export class UnauthorizedAccess extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
