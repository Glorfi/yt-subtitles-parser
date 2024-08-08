import { NextFunction, Response } from 'express';
//import getSubtitles from '../../api/getYouTubeCaptions.js';
import { Transcripts } from '../db/mongoConnector.js';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import { YoutubeTranscript } from 'youtube-transcript-shorts';
import { getVideoDetails } from 'youtube-caption-extractor';
import fetchVideoDetails from '../../api/getYouTubeCaptions.js';

export async function parseCaptions(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  const videoId = req.body.videoId;

  //const videoData = await getSubtitles({ videoID: videoId, lang: 'en' });
  const videoData = await YoutubeTranscript.fetchTranscript(videoId);
  console.log(videoData);

  // const videoDetails = await fetchVideoDetails(videoId);
  // if (!videoDetails) {
  //   return res.status(500).send('Error fetching subtitles');
  // }

  const transcriptEntity = {
    subtitleList: videoData,
  };
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      res.send(transcript);
    })
    .catch((err) => next(err));
}
