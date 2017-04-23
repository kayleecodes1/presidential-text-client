import { callApi } from './util.js';

function transformDocumentLabel(label) {
    return {
        id: label.documentLabelId,
        key: label.key,
        value: label.value,
        tag: `${label.key}:${label.value}`
    };
}

export const createDocumentLabel = (data) => callApi('documentlabels', 'POST', data, transformDocumentLabel);

export const getDocumentLabels = () => callApi('documentlabels', 'GET', null, (labels) => {
    return labels.map(transformDocumentLabel);
});

export const updateDocumentLabel = (documentLabelId, data) => callApi(`documentlabels/${documentLabelId}`, 'PUT', data, transformDocumentLabel);
