import { FetchPhoto } from './modules/fetch-photo-api';
import { refs } from './modules/refs';
import createPhotoCardMarkup from '../templates/photo-card-temp.hbs';

const fetchPhoto = new FetchPhoto();
let photosAreOver = null;

const renderGallery = enteredQuery => {
  fetchPhoto
    .byQuery(enteredQuery)
    .then(response => {
      const { data } = response;

      refs.gallery.insertAdjacentHTML('beforeend', createPhotoCardMarkup(data));

      if (data.total < 17) {
        photosAreOver = true;
      }
    })
    .catch(err => console.log(err));
};

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

const onFormSubmit = e => {
  e.preventDefault();
  const enteredQuery = e.target.searchQuery.value;

  fetchPhoto.page = 0;
  refs.gallery.innerHTML = '';
  renderGallery(enteredQuery);

  refs.loadMoreBtn.classList.remove('is-hidden');

  if (photosAreOver) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
};

const onLoadMoreBtnClick = e => {
  const enteredQuery = refs.searchForm.searchQuery.value;
  renderGallery(enteredQuery);
};

renderRandomGallery();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
