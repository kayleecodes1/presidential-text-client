import { callApi } from './util.js';

function transformDocumentLabel(label) {
    return {
        id: label.documentLabelId,
        title: label.title
    };
}

//TODO
export const createDocumentLabel = (data) => Promise.reject('API functionality not implemented.');

export const getDocumentLabels = () => callApi('documentlabels', 'GET', null, (labels) => {
    return labels.map(transformDocumentLabel);
});

//TODO
export const updateDocumentLabel = (documentLabelId, data) => Promise.reject('API functionality not implemented.');
