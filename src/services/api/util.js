import fetch from 'whatwg-fetch';

const API_URL = 'blah';

function checkStatus(response) {

    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

function parseJson(response) {

    return response.json();
}

export function callApi(path, method, data) {

    const options = { method };
    if (data) {
        options.body = JSON.stringify(data);
    }

    return new Promise((resolve, reject) => {
        fetch(`${API_URL}/${path}`, options)
            .then(checkStatus)
            .then(parseJson)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
