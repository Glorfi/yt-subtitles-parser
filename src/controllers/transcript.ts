import { NextFunction, Response } from 'express';
//import getSubtitles from '../../api/getYouTubeCaptions.js';
import { Transcripts } from '../db/mongoConnector.js';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import getYouTubeCaptions from '../../api/getYouTubeCaptions.js';

export async function parseCaptions(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  const videoId = req.body.videoId;

  const videoData = await getYouTubeCaptions({ videoID: videoId, lang: 'en' });
  if (!videoData) {
    return res.status(500).send('Error fetching subtitles');
  }

  const transcriptEntity = {
    title: videoData.videoDetails.title,
    subtitleList: videoData.subtitles,
  };
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      res.send(transcript);
    })
    .catch((err) => next(err));
}
