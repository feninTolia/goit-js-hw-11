import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { FetchPhoto } from './modules/fetch-photo-api';
import { refs } from './modules/refs';
import createPhotoCardMarkup from '../templates/photo-card-temp.hbs';

const observerOptions = {
  root: null,
  rootMargin: '0px 0px 300px 0px',
  treshold: 1,
};
const notiflixFailureOpt = {
  useIcon: false,
  clickToClose: false,
  timeout: 4000,
  fontSize: '15px',
  failure: {
    background: '#ffbfe6',
    textColor: '#000',
  },
};

const lightbox = new SimpleLightbox('.gallery a', {});

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    renderRandomGallery();
  }
}, observerOptions);

const fetchPhoto = new FetchPhoto();

//========= funcs and handlers ===========
const renderRandomGallery = async () => {
  try {
    const response = await fetchPhoto.preSetted();

    refs.gallery.insertAdjacentHTML(
      'beforeend',
      createPhotoCardMarkup(response.data)
    );

    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

const renderGallery = async enteredQuery => {
  try {
    const response = await fetchPhoto.byQuery(enteredQuery);
    const { data } = response;

    refs.gallery.insertAdjacentHTML('beforeend', createPhotoCardMarkup(data));

    lightbox.refresh();

    if (data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        notiflixFailureOpt
      );
      refs.searchForm.searchQuery.value = '';
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    if (data.total < fetchPhoto.perPage) {
      Notiflix.Notify.failure(
        `We found ${data.hits.length} pictures`,
        notiflixFailureOpt
      );
    }

    if (data.hits.length === fetchPhoto.perPage) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    } else if (data.hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        notiflixFailureOpt
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const onFormSubmit = e => {
  e.preventDefault();
  e.target.lastElementChild.disabled = true;
  fetchPhoto.page = 0;

  const enteredQuery = e.target.searchQuery.value;

  refs.gallery.innerHTML = '';
  renderGallery(enteredQuery);

  refs.searchBtn.classList.remove('.search-btn:hover');

  observer.unobserve(refs.infiniteScrollTrigger);
};

const onSearchQueryInput = () => {
  console.log('work');
  refs.searchForm.lastElementChild.disabled = false;
};

const onLoadMoreBtnClick = () => {
  const enteredQuery = refs.searchForm.searchQuery.value;
  renderGallery(enteredQuery);
};

//================ main actions ===========

renderRandomGallery();
observer.observe(refs.infiniteScrollTrigger);
refs.searchForm.addEventListener('submit', onFormSubmit);
refs.searchForm.searchQuery.addEventListener(
  'input',
  debounce(onSearchQueryInput, 1000, {
    leading: true,
    trailing: false,
  })
);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
