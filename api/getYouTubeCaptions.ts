// import puppeteer from 'puppeteer';
// import xml2js from 'xml2js';

// async function getSubtitles(videoId: string) {
//   // Запускаем браузер
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Открываем страницу видео на YouTube
//   await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
//     waitUntil: 'networkidle2', // Ждем, пока загрузка завершится
//   });

//   // Получаем HTML страницы
//   const content = await page.content();
//   const videoTitle = (await page.title()).split(' - ')[0];
//   console.log('Название видео:', videoTitle);

//   // Ищем URL субтитров с помощью регулярного выражения
//   const match = content.match(
//     /"https:\/\/www\.youtube\.com\/api\/timedtext\?([^"]+)"/
//   );
//   if (match) {
//     // Декодируем URL
//     const subtitleUrl = decodeURIComponent(
//       match[0].replace(/\\u0026/g, '&').slice(1, -1)
//     );
//     console.log('URL субтитров:', subtitleUrl);

//     // Открываем страницу субтитров и извлекаем текст
//     const response = await page.goto(subtitleUrl, {
//       waitUntil: 'networkidle2',
//     });
//     const subtitles = await response?.text();

//     // Убедитесь, что мы получили правильный текст
//     // console.log('Полученные данные:', subtitles?.slice(0, 500)); // Выводим первые 500 символов для проверки

//     // Удаляем лишние пробелы и символы перед первым тегом
//     const cleanedSubtitles = subtitles?.replace(/^\s+/, '');
//     // return subtitles;
//     // Печатаем очищенные данные
//     // console.log('Очищенные данные:', cleanedSubtitles?.slice(0, 500)); // Выводим первые 500 символов для проверки

//     // Парсим XML
//     const xmlParser = new xml2js.Parser();
//     try {
//       const result = await xmlParser.parseStringPromise(
//         cleanedSubtitles as string
//       );
//       const content = result.transcript.text
//       return { title: videoTitle, subtitles: content };
//     } catch (error) {
//       console.error('XML Parsing Error:', error);
//     }
//   } else {
//     console.log('Субтитры не найдены');
//   }

//   // Закрываем браузер
//   await browser.close();
// }

import * as puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import xml2js from 'xml2js';
import dotenv from 'dotenv';

interface Subtitle {
  _: string;
}

interface SubtitlesResponse {
  title: string;
  subtitles: Subtitle[];
}
dotenv.config();
async function getSubtitles(
  videoId: string
): Promise<SubtitlesResponse | null> {
  let browser = null;

  console.log(`Environment: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected');
    const executablePath = await chromium.executablePath();
    console.log(`Chromium executable path: ${executablePath}`);
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
  }

  if (!browser) {
    console.error('Failed to create a browser instance');
    throw new Error('Browser instance is not created');
  }

  // try {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('Development browser: ');
  //     browser = await puppeteer.launch({
  //       args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //       headless: true,
  //     });
  //   } else if (process.env.NODE_ENV === 'production') {
  //     console.log('Production browser: ');
  //     browser = await puppeteerCore.launch({
  //       args: chromium.args,
  //       defaultViewport: chromium.defaultViewport,
  //       executablePath: await chromium.executablePath(),
  //       headless: chromium.headless,
  //     });
  //   }

  if (!browser) {
    throw new Error('Browser instance is not created');
  }

  const page = await browser.newPage();

  console.log(`Открываем видео: https://www.youtube.com/watch?v=${videoId}`);

  // Открываем страницу видео на YouTube
  await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
    waitUntil: 'networkidle2',
  });

  // Получаем HTML страницы
  const content = await page.content();
  const videoTitle = (await page.title()).split(' - ')[0];
  console.log('Название видео:', videoTitle);

  // Ищем URL субтитров с помощью регулярного выражения
  const match = content.match(
    /"https:\/\/www\.youtube\.com\/api\/timedtext\?([^"]+)"/
  );
  if (match) {
    // Декодируем URL
    const subtitleUrl = decodeURIComponent(
      match[0].replace(/\\u0026/g, '&').slice(1, -1)
    );
    console.log('URL субтитров:', subtitleUrl);

    // Открываем страницу субтитров и извлекаем текст
    const response = await page.goto(subtitleUrl, {
      waitUntil: 'networkidle2',
    });
    const subtitles = await response?.text();

    // Удаляем лишние пробелы и символы перед первым тегом
    const cleanedSubtitles = subtitles?.replace(/^\s+/, '');

    // Парсим XML
    const xmlParser = new xml2js.Parser();
    try {
      const result = await xmlParser.parseStringPromise(
        cleanedSubtitles as string
      );
      const content = result.transcript.text;
      const obj: SubtitlesResponse = {
        title: videoTitle,
        subtitles: content,
      };
      await browser.close();
      return obj;
    } catch (error) {
      console.error('XML Parsing Error:', error);
      throw new Error('XML Parsing Error:');
    }
  } else {
    console.log('Субтитры не найдены');
    throw new Error('Субтитры не найдены');
  }
}

export default getSubtitles;
