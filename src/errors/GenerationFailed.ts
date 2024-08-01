export interface GenerationFailed extends Error {
  statusCode: number;
  message: string;
}

export class GenerationFailed extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 406;
  }
}
