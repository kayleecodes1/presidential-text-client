import { callApi } from './util.js';

function transformDocumentSummary(document) {
    return {
        id: document.documentId,
        title: document.title,
        date: document.deliveryDate,
        speakerId: document.speaker.speakerId,
        speakerName: document.speaker.name
    };
}

function transformDocumentDetail(document) {
    return {
        id: document.documentId,
        title: document.title,
        date: document.deliveryDate,
        speakerId: document.speaker.speakerId,
        speakerName: document.speaker.name,
        textContent: document.fullText
    };
}

export const createDocument = (data) => Promise.reject('API functionality not implemented.');
/*export const createDocument = (data) => callApi('documents', 'POST', data, () => {
    //TODO
});*/

export const getDocuments = () => callApi('leandocuments', 'GET', null, (documents) => {
    return documents.map(transformDocumentSummary);
});

export const searchDocuments = (keyword) => Promise.reject('API functionality not implemented.');
/*export const searchDocuments = (keyword) => new Promise((resolve) => {
    setTimeout(() => {
        resolve([1, 2, 3, 4, 5]);
    }, 500);
});*/
//export const searchDocuments = (keyword) => callApi('documents/search/POST', 'POST', { keyword });

export const getDocument = (documentId) => callApi(`documents/${documentId}`, 'GET', null, (document) => {
    return transformDocumentDetail(document);
});

export const updateDocument = (documentId, data) => Promise.reject('API functionality not implemented.');
/*export const updateDocument = (documentId, data) => callApi(`documents/${documentId}`, 'PUT', data, () => {
    //TODO
});*/

export const deleteDocument = (documentId) => Promise.reject('API functionality not implemented.');
/*export const deleteDocument = (documentId) => callApi(`documents/${documentId}`, 'DELETE', null, () => {
    //TODO
});*/
