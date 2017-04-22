import { callApi } from './util.js';

function transformSpeakerSummary(speaker) {
    return {
        id: speaker.speakerId,
        name: speaker.name,
        terms: speaker.terms.map((term) => ({
            id: term.termId,
            startDate: term.startDate,
            endDate: term.endDate
        })),
        labels: speaker.labels.map((label) => ({
            id: label.speakerLabelId
        }))
    };
}

function transformSpeakerDetail(speaker) {
    return {
        id: speaker.speakerId,
        name: speaker.name,
        terms: speaker.terms.map((term) => ({
            id: term.termId,
            startDate: term.startDate,
            endDate: term.endDate
        })),
        labels: speaker.labels.map((label) => ({
            id: label.speakerLabelId
        }))
    };
}

export const createSpeaker = (data) => Promise.reject('API functionality not implemented.');
/*export const createSpeaker = (data) => callApi('speakers', 'POST', data, () => {
    //TODO
});*/

export const getSpeakers = () => callApi('speakers', 'GET', null, (speakers) => {
    return speakers.map(transformSpeakerSummary);
});

export const getSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'GET', null, (speaker) => {
    return transformSpeakerDetail(speaker);
});

export const updateSpeaker = (speakerId, data) => Promise.reject('API functionality not implemented.');
/*export const updateSpeaker = (speakerId, data) => callApi(`speakers/${speakerId}`, 'PUT', data, () => {
    //TODO
});*/

export const deleteSpeaker = (speakerId) => Promise.reject('API functionality not implemented.');
/*export const deleteSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'DELETE', null, () => {
    //TODO
});*/
