//import { callApi } from './util.js';

export function login(email, password) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email !== 'kylepixel@gmail.com' || password !== 'password') {
                reject(new Error('Email or password is invalid.'));
                return;
            }
            resolve({
                isAdmin: true,
                name: 'Kyle Maguire',
                email: 'kylepixel@gmail.com'
            });
        }, 1000);
    });
    //return callApi('login', 'POST', { email, password });
}

export function logout() {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
    //return callApi('logout', 'POST');
}
