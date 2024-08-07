import { Request } from 'express';

export interface IParseCaptionBodyRequest extends Request {
  body: { videoId: string };
}
