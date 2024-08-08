import { NextFunction, Response } from 'express';
//import getSubtitles from '../../api/getYouTubeCaptions.js';
import { Transcripts } from '../db/mongoConnector.js';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

export async function parseCaptions(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  const videoId = req.body.videoId;

  const subs = await getSubtitles({ videoID: videoId, lang: 'en' });
  const videoDetails = await getVideoDetails({ videoID: videoId, lang: 'en' });
  if (!subs) {
    return res.status(500).send('Error fetching subtitles');
  }

  const transcriptEntity = {
    title: videoDetails.title,
    subtitleList: subs,
  };
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      res.send(transcript);
    })
    .catch((err) => next(err));
}
