//import { callApi } from './util.js';

export function createDocument(title, text, date, speakerId, customLabels) {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
    //return callApi('documents', 'POST', { title, text, date, speakerId, customLabels });
}

//TODO: update

//TODO: delete
