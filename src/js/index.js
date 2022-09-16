import { FetchPhoto } from './modules/fetch-photo-api';
import { refs } from './modules/refs';
import createPhotoCardMarkup from '../templates/photo-card-temp.hbs';

const fetchPhoto = new FetchPhoto();

const renderRandomGallery = () => {
  fetchPhoto
    .preSetted()
    .then(response => {
      const { data } = response;

      refs.gallery.insertAdjacentHTML(
        'afterbegin',
        createPhotoCardMarkup(data)
      );
    })
    .catch(err => console.log(err));
};

const renderGallery = enteredQuery => {
  fetchPhoto
    .byQuery(enteredQuery)
    .then(response => {
      const { data } = response;

      refs.gallery.insertAdjacentHTML('beforeend', createPhotoCardMarkup(data));

      if (data.hits.length < 16) {
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch(err => console.log(err));
};

const onFormSubmit = e => {
  e.preventDefault();
  const enteredQuery = e.target.searchQuery.value;
  e.target.lastElementChild.disabled = true;
  refs.searchBtn.classList.remove('.search-btn:hover');

  fetchPhoto.page = 0;
  refs.gallery.innerHTML = '';
  renderGallery(enteredQuery);

  refs.loadMoreBtn.classList.remove('is-hidden');
};

const onSearchQueryInput = () => {
  refs.searchForm.lastElementChild.disabled = false;
};

const onLoadMoreBtnClick = e => {
  const enteredQuery = refs.searchForm.searchQuery.value;
  renderGallery(enteredQuery);
};

renderRandomGallery();
refs.searchForm.addEventListener('submit', onFormSubmit);
refs.searchForm.searchQuery.addEventListener('input', onSearchQueryInput);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
