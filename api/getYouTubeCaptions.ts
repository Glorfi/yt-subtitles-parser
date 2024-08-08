import { getVideoDetails } from 'youtube-caption-extractor';

const fetchVideoDetails = async (videoID: string, lang = 'en') => {
  try {
    const videoDetails = await getVideoDetails({ videoID, lang });
    console.log(videoDetails);
    return videoDetails;
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
};

export default fetchVideoDetails;
