import { NextFunction, Response } from 'express';
//import getSubtitles from '../../api/getYouTubeCaptions.js';
import { Transcripts } from '../db/mongoConnector.js';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';

import { getVideoDetails } from 'youtube-caption-extractor';
import fetchVideoDetails from '../../api/getYouTubeCaptions.js';

export async function parseCaptions(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  const videoId = req.body.videoId;

  const videoData = await getVideoDetails({ videoID: videoId, lang: 'en' });

  const transcriptEntity = {
    title: videoData.title,
    subtitleList: videoData.subtitles,
  };
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      res.send(transcript);
    })
    .catch((err) => next(err));
}
