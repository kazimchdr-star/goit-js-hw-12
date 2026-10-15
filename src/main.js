import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './styles.css';
import { searchImages } from './pixabay-api';
import { clearGallery, renderGallery, setLoading } from './render-functions';

const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
let query = '';
let page = 1;
let loadedCount = 0;
let hasMore = false;
let isLoading = false;
let currentRequest;

iziToast.settings({ position: 'topRight', timeout: 5000, closeOnClick: true });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nextQuery = input.value.trim();
  if (!nextQuery) {
    iziToast.warning({ message: 'Please enter a search term.' });
    input.focus();
    return;
  }
  currentRequest?.abort();
  query = nextQuery;
  page = 1;
  loadedCount = 0;
  hasMore = false;
  loadMore.hidden = true;
  clearGallery();
  await loadImages();
});

loadMore.addEventListener('click', async () => {
  if (isLoading || !hasMore) return;
  await loadImages();
});

async function loadImages() {
  const controller = new AbortController();
  currentRequest = controller;
  const requestedPage = page;
  isLoading = true;
  loadMore.hidden = true;
  setLoading(true);
  try {
    const { hits, totalHits } = await searchImages(
      query,
      requestedPage,
      controller.signal,
    );
    if (controller !== currentRequest) return;
    if (requestedPage === 1 && hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    renderGallery(hits);
    loadedCount += hits.length;
    page = requestedPage + 1;
    hasMore = hits.length > 0 && loadedCount < totalHits;
    if (!hasMore) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
    if (requestedPage > 1 && hits.length > 0) {
      const { height } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    }
  } catch (error) {
    if (controller !== currentRequest || axios.isCancel(error)) return;
    iziToast.error({
      message: axios.isAxiosError(error)
        ? 'Unable to load images. Please check your connection and try again.'
        : error.message,
    });
  } finally {
    if (controller === currentRequest) {
      isLoading = false;
      setLoading(false);
      loadMore.hidden = !hasMore;
    }
  }
}
