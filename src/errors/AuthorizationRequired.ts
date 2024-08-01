export interface AuthorizationRequired extends Error {
  statusCode: number;
  message: string;
}

export class AuthorizationRequired extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
