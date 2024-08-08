// Определяем типы для опций функции
interface Options {
  videoID: string;
  lang?: string;
}

// Определяем тип для субтитров
interface Subtitle {
  start: string;
  dur: string;
  text: string;
}

// Определяем тип для возвращаемого значения функции
interface VideoDetails {
  title: string;
  description: string;
  subtitles: Subtitle[];
}

// Определяем тип для CaptionTrack
interface CaptionTrack {
  vssId: string;
  baseUrl: string;
}

// Функция с типизацией
import fetch from 'node-fetch';
import he from 'he';
import striptags from 'striptags';

export const getVideoDetails = async ({
  videoID,
  lang = 'en',
}: Options): Promise<any> => {
  const response = await fetch(`https://youtube.com/watch?v=${videoID}`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  });
  const data = await response.text();

  console.log(data); // Логируем весь ответ от YouTube

  const titleMatch = data.match(
    /<meta name="title" content="([^"]*|[^"]*[^&]quot;[^"]*)">/
  );
  const descriptionMatch = data.match(
    /<meta name="description" content="([^"]*|[^"]*[^&]quot;[^"]*)">/
  );

  const title = titleMatch ? titleMatch[1] : 'No title found';
  const description = descriptionMatch
    ? descriptionMatch[1]
    : 'No description found';

  if (!data.includes('captionTracks')) {
    console.log(`No captions found for video: ${videoID}`);
    return {
      title,
      description,
      subtitles: [],
    };
  }

  const regex = /"captionTracks":(\[.*?\])/;
  const regexResult = regex.exec(data);

  if (!regexResult) {
    console.log(`Failed to extract captionTracks from video: ${videoID}`);
    return {
      title,
      description,
      subtitles: [],
    };
  }

  const [_, captionTracksJson] = regexResult;
  const captionTracks: CaptionTrack[] = JSON.parse(captionTracksJson);
  return captionTracks;

  // const subtitle =
  //   captionTracks.find((track) => track.vssId === `.${lang}`) ||
  //   captionTracks.find((track) => track.vssId === `a.${lang}`) ||
  //   captionTracks.find((track) => track.vssId && track.vssId.match(`.${lang}`));

  // if (!subtitle?.baseUrl) {
  //   console.log(`Could not find ${lang} captions for ${videoID}`);
  //   return {
  //     title,
  //     description,
  //     subtitles: [],
  //   };
  // }

  // const subtitlesResponse = await fetch(subtitle.baseUrl, {
  //   headers: {
  //     'User-Agent':
  //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //   },
  // });
  // const transcript = await subtitlesResponse.text();

  // const startRegex = /start="([\d.]+)"/;
  // const durRegex = /dur="([\d.]+)"/;

  // const lines = transcript
  //   .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
  //   .replace('</transcript>', '')
  //   .split('</text>')
  //   .filter((line) => line && line.trim())
  //   .reduce((acc: Subtitle[], line) => {
  //     const startResult = startRegex.exec(line);
  //     const durResult = durRegex.exec(line);

  //     if (!startResult || !durResult) {
  //       console.log(`Failed to extract start or duration from line: ${line}`);
  //       return acc;
  //     }

  //     const [, start] = startResult;
  //     const [, dur] = durResult;

  //     const htmlText = line
  //       .replace(/<text.+>/, '')
  //       .replace(/&amp;/gi, '&')
  //       .replace(/<\/?[^>]+(>|$)/g, '');
  //     const decodedText = he.decode(htmlText);
  //     const text = striptags(decodedText);

  //     acc.push({
  //       start,
  //       dur,
  //       text,
  //     });

  //     return acc;
  //   }, []);

  // return {
  //   title,
  //   description,
  //   subtitles: lines,
  // };
};
