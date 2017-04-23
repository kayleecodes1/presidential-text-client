import { callApi } from './util.js';

function transformSpeakerLabel(label) {
    return {
        id: label.speakerLabelId,
        key: label.key,
        value: label.value,
        tag: `${label.key}:${label.value}`
    };
}

export const createSpeakerLabel = (data) => callApi('speakerlabels', 'POST', data, transformSpeakerLabel);

export const getSpeakerLabels = () => callApi('speakerlabels', 'GET', null, (labels) => {
    return labels.map(transformSpeakerLabel);
});

export const updateSpeakerLabel = (speakerLabelId, data) => callApi(`speakerlabels/${speakerLabelId}`, 'PUT', data, transformSpeakerLabel);
