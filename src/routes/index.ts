import express from 'express';
import getSubtitles from '../utils/getYouTubeCaptions.js';
import toSrtTime from '../utils/toSrtTime.js';
import fs from 'fs';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';
import { Transcripts } from '../db/mongoConnector.js';
import { parseCaptions } from '../controllers/transcript.js';
import { parseAndTransformToText } from '../controllers/texts.js';

export const router = express.Router();

router.post('/subtitles', parseCaptions);
router.post('/texts', parseAndTransformToText);

// MAKING SRT LOGIC
// let srtContent = purifiedSubs
// .map((item: any, index: any) => {
//   const startTime = toSrtTime(parseFloat(item.$.start));
//   const endTime = toSrtTime(
//     parseFloat(item.$.start) + parseFloat(item.$.dur)
//   );
//   return `${index + 1}\n${startTime} --> ${endTime}\n${item._}\n`;
// })
// .join('\n');

// fs.writeFileSync(`${videoId}.srt`, srtContent);
// res.send('File Created!');
