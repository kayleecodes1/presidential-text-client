import 'whatwg-fetch';
import { push } from 'react-router';

export const API_URL = __DEV__ ? __API_URL__ : window.__CONFIG__.apiUrl;

export function checkStatus(response) {

    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    if (response.status === 403) {
        document.cookie = 'token=';
        document.cookie = 'username=';
        window.dispatchEvent(new Event('app.unauthorized'));
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function parseJson(response) {

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
    }
}

export function callApi(path, method, data, transform, isSecure) {

    const options = {
        method,
        headers: {}
    };
    if (isSecure) {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        options.headers.Authorization = token;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const url = `${API_URL}/${path}`;
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(checkStatus)
            .then(parseJson)
            .then((data) => {
                if (transform) {
                    data = transform(data);
                }
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
