import { callApi } from './util.js';

export const login = (email, password) => callApi('login', 'POST', { email, password }, () => {
    if (email !== 'kylepixel@gmail.com' || password !== 'password') {
        return Promise.reject(new Error('Email or password is invalid.'));
    }
    return Promise.resolve({
        isAdmin: true,
        name: 'Kyle Maguire',
        email: 'kylepixel@gmail.com'
    });
});

export const logout = () => callApi('logout', 'POST', null, () => {
    return Promise.resolve();
});
