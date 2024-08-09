import { Innertube } from 'youtubei.js/web';
import { IParseCaptionBodyRequest } from '../interfaces/requests/ParseCaption.js';
import { NextFunction, Response } from 'express';

export async function parseWithInnerTube(
  req: IParseCaptionBodyRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });
    
    const videoId = req.body.videoId;
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    if (!transcriptData || !transcriptData.transcript?.content?.body?.initial_segments) {
      throw new Error('Transcript data is unavailable.');
    }

    const data = transcriptData.transcript.content.body.initial_segments.map(
      (segment) => segment.snippet.text
    );
    
    res.send(data);
  } catch (error) {
    next(error); // Passing the error to the next middleware (e.g., error handler)
  }
}
