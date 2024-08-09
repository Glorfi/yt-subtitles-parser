import * as puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import xml2js from 'xml2js';
import dotenv from 'dotenv';

dotenv.config();
export default async function getSubtitles(videoId: string) {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  let browser;

  if (process.env.NODE_ENV === 'development') {
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
    } catch (error) {
      console.error('Error launching Puppeteer in development:', error);
    }
  }
  if (process.env.NODE_ENV === 'production') {
    try {
      const executablePath = await chromium.executablePath();
      console.log('Chromium executable path:', executablePath);

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } catch (error) {
      console.error('Error launching PuppeteerCore in production:', error);
    }
  }

  if (!browser) {
    throw new Error('Browser instance is not created');
  }

  const page = await browser.newPage();

  console.log(`Открываем видео: https://www.youtube.com/watch?v=${videoId}`);

  // Открываем страницу видео на YouTube
  await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
    waitUntil: 'domcontentloaded',
  });

  const content = await page.content();
  const videoTitle = (await page.title()).split(' - ')[0];
  console.log('Название видео:', videoTitle);

  const match = content.match(
    /"https:\/\/www\.youtube\.com\/api\/timedtext\?([^"]+)"/
  );

  if (match) {
    const subtitleUrl = decodeURIComponent(
      match[0].replace(/\\u0026/g, '&').slice(1, -1)
    );
    console.log('URL субтитров:', subtitleUrl);

    const response = await page.goto(subtitleUrl, {
      waitUntil: 'networkidle2',
    });
    const subtitles = await response?.text();
    const cleanedSubtitles = subtitles?.replace(/^\s+/, '');

    const xmlParser = new xml2js.Parser();
    try {
      const result = await xmlParser.parseStringPromise(
        cleanedSubtitles as string
      );
      const content = result.transcript.text;
      const obj: any = {
        title: videoTitle,
        subtitles: content,
      };
      return obj;
    } catch (error) {
      console.error('XML Parsing Error:', error);
      throw new Error('XML Parsing Error');
    }
  } else {
    console.log('Субтитры не найдены');
    throw new Error('Субтитры не найдены');
  }
}
