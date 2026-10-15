# JavaScript Homework 12

Pixabay image search built on the Homework 11 code with Vite, Axios, async/await, iziToast and SimpleLightbox.

- 40 images per request; each new search starts at page 1.
- Load more appends results and refreshes SimpleLightbox.
- A loader appears below the button while requesting images.
- The button disappears at the end of the collection, with a notification.
- Additional pages scroll smoothly by twice the gallery card height.
- New searches cancel earlier requests; failed additional pages can be retried.

## Local setup

```sh
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_PIXABAY_API_KEY` in `.env` to your Pixabay API key. A local `.env` is already configured when available; it is excluded from Git. Browser applications expose their API key in network requests, so use a key intended for this demo.

```sh
npm run build
npm run preview
npm run format:check
```

## GitHub Pages

The included workflow builds and deploys pushes to `main`. Set the repository Actions secret `VITE_PIXABAY_API_KEY` and choose **GitHub Actions** under Settings > Pages before deployment.

- Repository: https://github.com/kazimchdr-star/goit-js-hw-12
- Pages address after deployment: https://kazimchdr-star.github.io/goit-js-hw-12/

The detailed assignment specifies `per_page=40`; its checklist also mentions 20. This implementation follows the detailed requirement of 40.
