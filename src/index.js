import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputSearchRef = document.querySelector('#search-box');
const countiesListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputSearchRef.addEventListener(
  'input',
  debounce(onInputFetchCounties, DEBOUNCE_DELAY)
);

function onInputFetchCounties(e) {
  if (!e.target.value) {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
    .then(res => {
      if (res.length > 10) {
        countiesListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (res.length >= 2 && res.length <= 10) {
        const itemList = res
          .map(el => {
            return `
              <li class="country-item">
                <img src=${el.flags.svg} alt=${el.name.official} width="30" height='20' />
                ${el.name.official}
              </li>`;
          })
          .join('');
        countryInfoRef.innerHTML = '';
        countiesListRef.innerHTML = itemList;
      } else {
        const countryInfo = res
          .map(el => {
            const languages = Object.values(el.languages).join(', ');
            return `
              <div class="country-title">
                <img src=${el.flags.svg} alt=${el.name.official} width="40" height='30'/>
                <h1>${el.name.official}</h1>
              </div>
              <p class="country-desc"><span>Capital:</span> ${el.capital}</p>
              <p class="country-desc"><span>Population:</span> ${el.population}</p>
              <p class="country-desc"><span>Languages:</span> ${languages}</p>`;
          })
          .join('');
        countiesListRef.innerHTML = '';
        countryInfoRef.innerHTML = countryInfo;
      }
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}
