'use strict';
import axios from 'axios';

export class FetchPhoto {
  #BASE_URL;
  #API_KEY;

  constructor() {
    this.#API_KEY = '29946352-1a4291eb7954147c8b1f721f5';
    this.#BASE_URL = 'https://pixabay.com';
    this.page = 0;
    this.perPage = 40;
  }

  byQuery(querry) {
    this.page += 1;

    const options = {
      q: querry,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.perPage,
      page: this.page,
      key: this.#API_KEY,
    };

    return axios.get(`${this.#BASE_URL}/api/`, {
      params: options,
    });
  }

  preSetted() {
    const randomNumber = Math.floor(Math.random() * (50 - 1)) + 1;

    const options = {
      q: 'forest',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 4,
      page: randomNumber,
      key: this.#API_KEY,
    };

    return axios.get(`${this.#BASE_URL}/api/`, {
      params: options,
    });
  }
}
