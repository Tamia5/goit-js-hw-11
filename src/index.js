import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';
let hasSearched = false;
let lightbox;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39300767-f0d69d4d22ce0cdc344bb6eaf';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.failure("Please enter a search query.");
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  currentQuery = searchQuery;
  hasSearched = true;
  await searchImages(currentQuery, page);
});

loadMoreBtn.addEventListener('click', () => {
    if (!hasSearched) {
    return; 
  }
  page += 1;
  searchImages(currentQuery, page);
});

async function searchImages(query, pageNumber) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNumber,
        per_page: 40,
      },
    });

    const { data } = response;
    const images = data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      renderImages(images);
      if (pageNumber === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    }

    if (images.length < 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderImages(images) {
  const html = images.map((image) => `
    <div class="photo-card">
      <a href="${image.largeImageURL}" class="lightbox">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `).join('');

  gallery.insertAdjacentHTML('beforeend', html);

    if (lightbox) {
    lightbox.destroy();
  }
 lightbox = new SimpleLightbox('.lightbox');
//   const lightbox = new SimpleLightbox('.lightbox');
//   lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .lastElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0,
    behavior: 'smooth',
  });
}
loadMoreBtn.classList.add('is-hidden');