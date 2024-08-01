import { Request, Response, NextFunction, RequestHandler } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { AuthorizationRequired } from '../errors/AuthorizationRequired.js';


interface AuthRequest extends Request {
  user?: any;
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new AuthorizationRequired('Authorization Required');
  }
  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    throw new AuthorizationRequired('Authorization Required');
  }
  let payload;
  try {
    const secret: string = process.env.JWT_SECRET || "supersecret"
    payload = jsonwebtoken.verify(token, secret);
  } catch (error) {
    throw new AuthorizationRequired('Authorization Required');
  }
  req.user = payload;
  return next();
};
