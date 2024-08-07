import { NextFunction, Response } from 'express';
import getSubtitles from '../../api/getYouTubeCaptions.js';
import { Transcripts } from '../db/mongoConnector.js';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';

export async function parseCaptions(
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

  const transcriptEntity = {
    title: subs.title,
    subtitleList: purifiedSubs,
    rawText,
  };
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      res.send(transcript);
    })
    .catch((err) => next(err));
}
