import express from 'express';
import getSubtitles from '../../api/getYouTubeCaptions.js';
import toSrtTime from '../utils/toSrtTime.js';
import fs from 'fs';
import decodeHTMLEntities from '../utils/decodeHTMLEntities.js';
import { Transcripts } from '../db/mongoConnector.js';

export const router = express.Router();

router.post('/subs', async function (req, res, next) {
  const videoId = req.body.videoId;
  console.time('Parsed SubTitle');
  const subs = await getSubtitles(videoId);
  if (!subs) {
    return res.status(500).send('Error fetching subtitles');
  }
  console.timeEnd('Parsed SubTitle');
  console.time('Changed cleaning HTML elements');
  const purifiedSubs = subs.subtitles.map((item: any) => {
    const text = decodeHTMLEntities(item._);
    return {
      ...item,
      _: text,
    };
  });
  console.timeEnd('Changed cleaning HTML elements');
  const rawText = purifiedSubs.map((item: any) => item._).join('');

  const transcriptEntity = {
    title: subs.title,
    subtitleList: purifiedSubs,
    // rawText: rawText
  };
  console.time('Recording to DB');
  Transcripts.create(transcriptEntity)
    .then((transcript) => {
      console.timeEnd('Recording to DB');
      console.time('sending request');
      res.send(transcript._id);
      console.timeEnd('sending request');
    })
    .catch((err) => next(err));
});


// router.use('/auth', regRouter);
// router.use('/users', auth, usersRouter);
// router.use('/exercises', exsRouter);
// router.use('/sentences', auth, sentencesRouter);
// router.use('/topics', auth, topicsRouter);
//router.get('/crash', () => {throw new Error("Я упал подними меня")})

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
