import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loading = document.querySelector('.loading');
const attribution = document.querySelector('.attribution');
const status = document.querySelector('#search-status');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[character];
  });
}

function safeImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escapeHtml(url.href) : '';
  } catch {
    return '';
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
  attribution.hidden = true;
  status.textContent = '';
  lightbox.refresh();
}

export function renderGallery(images) {
  const markup = images
    .map((image) => {
      const statistics = ['likes', 'views', 'comments', 'downloads']
        .map(
          (name) =>
            `<div class="stat"><dt>${name[0].toUpperCase() + name.slice(1)}</dt><dd>${Number(image[name]) || 0}</dd></div>`,
        )
        .join('');

      return `<li class="gallery-item">
      <a class="gallery-link" href="${safeImageUrl(image.largeImageURL)}">
        <img class="gallery-image" src="${safeImageUrl(image.webformatURL)}" alt="${escapeHtml(image.tags)}" width="360" height="200" loading="lazy" />
      </a>
      <dl class="statistics">${statistics}</dl>
    </li>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  attribution.hidden = images.length === 0;
  status.textContent = `${gallery.children.length} images loaded.`;
}

export function setLoading(isLoading) {
  loading.hidden = !isLoading;
  gallery.setAttribute('aria-busy', String(isLoading));
}
