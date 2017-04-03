import 'whatwg-fetch';

let API_URL = __DEV__ ? __API_URL__ : window.__CONFIG__.apiUrl;

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

export function callApi(path, method, data, transform) {

    const options = { method };
    if (data) {
        options.headers = { 'Content-Type': 'application/json' };
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
