import { callApi } from './util.js';

function transformSpeakerLabel(label) {
    return {
        id: label.speakerLabelId,
        title: label.title
    };
}

//TODO
export const createSpeakerLabel = (data) => Promise.reject('API functionality not implemented.');

export const getSpeakerLabels = () => callApi('speakerlabels', 'GET', null, (labels) => {
    return labels.map(transformSpeakerLabel);
});

//TODO
export const updateSpeakerLabel = (speakerLabelId, data) => Promise.reject('API functionality not implemented.');
