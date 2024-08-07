import { NextFunction, Response } from 'express';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import getSubtitles from '../../api/getYouTubeCaptions.js';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';
import { openAIRequest } from '../utils/openAIrequest.js';

export async function parseAndTransformToText(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  const videoId = req.body.videoId;
  const subs = await getSubtitles(videoId);
  if (!subs) {
    return res.status(500).send('Error fetching subtitles');
  }

  const purifiedSubs = subs.subtitles.map((item: any) => {
    const text = decodeHTMLEntities(item._);
    return {
      ...item,
      _: text,
    };
  });
  const rawText = purifiedSubs.map((item: any) => item._).join('');
  const html = await openAIRequest(
    `Return json with the following schema: {"body":  'Format this text in form of readable HTML, no styles'}. Text: ${rawText}`
  );

  res.send(html);
}
