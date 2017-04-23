import { callApi } from './util.js';

function transformDocumentSummary(document) {
    return {
        id: document.documentId,
        title: document.title,
        date: document.deliveryDate,
        speakerId: document.speaker.speakerId,
        speakerName: document.speaker.name,
        labels: document.labels.map((label) => ({
            id: label.documentLabelId
        }))
    };
}

function transformDocumentDetail(document) {
    return {
        id: document.documentId,
        title: document.title,
        date: document.deliveryDate,
        speakerId: document.speaker.speakerId,
        speakerName: document.speaker.name,
        textContent: document.fullText,
        labels: document.labels.map((label) => ({
            id: label.documentLabelId
        }))
    };
}

export const createDocument = (data) => callApi('documents', 'POST', data, transformDocumentSummary);

export const getDocuments = () => callApi('leandocuments', 'GET', null, (documents) => {
    return documents.map(transformDocumentSummary);
});

export const searchDocuments = (keyword) => callApi(`leandocuments/search?keyword=${encodeURIComponent(keyword)}`, 'GET', null, (documents) => {
    return documents.map((document) => document.documentId);
});

export const getDocument = (documentId) => callApi(`documents/${documentId}`, 'GET', null, (document) => {
    return transformDocumentDetail(document);
});

export const updateDocument = (documentId, data) => callApi(`documents/${documentId}`, 'PUT', data, transformDocumentSummary);

export const deleteDocument = (documentId) => Promise.reject('API functionality not implemented.');
/*export const deleteDocument = (documentId) => callApi(`documents/${documentId}`, 'DELETE', null, () => {
    //TODO
});*/
