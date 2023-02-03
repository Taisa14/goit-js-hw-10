import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const input = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRY_NUMBER = 10;

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

export function clearField() {
    listCountry.innerHTML = '';
    infoCountry.innerHTML = '';
}

function onSearch(evn) {
    const inputValue = evn.target.value.trim();

    if (inputValue === '') {
        clearField();
        return;
    } else if (inputValue !== '') {
        fetchCountries(inputValue)
            .then(countryData => renderCountries(countryData))
            .catch(err => {
                if (err.message === '404') {
                    return Notify.failure('Oops, there is no country with that name');
                }
            });
    }
}

function renderCountries(countryData) {
    console.log(countryData);

    if (countryData.length >= MAX_COUNTRY_NUMBER) {
        clearField();

        return Notify.info('Too many matches found. Please enter a more specific name.');

    } else if (countryData.length <= MAX_COUNTRY_NUMBER) {
        markupCountries(countryData);
    }
}

function markupCountries(data) {
    let markup = '';
    const oneCountry = data.length === 1;

    clearField();

    markup = data.map(({ name, flags }) => {
        return `<li class="country-list__item">
        <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width ='10%'/>
        <h2 class="country-list__title">${name.official}</h2>         
        </li>`;
    }).join('');
    listCountry.insertAdjacentHTML('beforeend', markup);

    if (oneCountry) {
        markup = data.map(({ capital, population, languages }) => {
            return `<p><span>Capital:</span> ${capital}</p>
            <p><span>Population:</span> ${population}</p>        
           <p><span>Languages:</span> ${Object.values(languages).join(', ')} </p>`;
        }).join('');
        infoCountry.insertAdjacentHTML('beforeend', markup);
    }
}
