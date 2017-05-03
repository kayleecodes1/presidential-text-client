import 'whatwg-fetch';
import { API_URL, callApi } from './util.js';

//TODO: use biglongstring if present
export const checkAuth = () => callApi('users', 'GET', null, () => {
    const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, '$1');
    return username;
}, true);

export const login = (username, password) => {
    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({ username, password })
        };

        fetch(`${API_URL}/login`, options)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            })
            .then((response) => {
                const authHeader = response.headers.get('Authorization');
                const parseResult = authHeader.match(/^Bearer (.*)$/);
                if (!parseResult) {
                    reject('Invalid response from server.');
                    return;
                }
                const token = parseResult[1];
                document.cookie = `token=${token}`;
                document.cookie = `username=${username}`;
                resolve(checkAuth());
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const logout = () => {
    document.cookie = 'token=';
    document.cookie = 'username=';
    window.dispatchEvent(new Event('app.unauthorized'));
};

/*export const logout = () => callApi('logout', 'POST', null, () => {
    //TODO
});*/
