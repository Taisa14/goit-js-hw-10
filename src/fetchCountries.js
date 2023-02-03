import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { clearField } from './index.js';

function errorName() {
    return Notify.failure(`Oops, there is no country with that name`);
}

export function fetchCountries(name) {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';

    return fetch(`${BASE_URL}${name}?name,capital,population,flags,languages`)
        .then(resp => {
            if (!resp.ok) {
                errorName();
                throw new Error(resp.statusText);
            }
            return resp.json();
        })
        .catch(err => {
            console.error(err);
            clearField();
        });
}