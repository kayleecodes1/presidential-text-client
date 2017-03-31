import { callApi } from './util.js';

export const login = (email, password) => callApi('login', 'POST', { email, password }, () => {
    //TODO
});

export const logout = () => callApi('logout', 'POST', null, () => {
    //TODO
});
