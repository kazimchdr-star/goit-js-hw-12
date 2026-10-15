import axios from 'axios';

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY?.trim();
export const PER_PAGE = 40;

export async function searchImages(query, page, signal) {
  if (!API_KEY || API_KEY === 'your_pixabay_api_key') {
    throw new Error(
      'Image search is not configured yet. Please add a Pixabay API key.',
    );
  }
  const { data } = await axios.get('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: PER_PAGE,
    },
    signal,
    timeout: 15000,
  });
  if (
    !Array.isArray(data.hits) ||
    !Number.isInteger(data.totalHits) ||
    data.totalHits < 0
  ) {
    throw new Error('An unexpected response was received. Please try again.');
  }
  return data;
}
