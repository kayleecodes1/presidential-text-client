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

export const getSpeakers = () => callApi('speakers', 'GET', null, (speakers) => {
    return speakers.map(transformSpeakerSummary);
});

export const getSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'GET', null, transformSpeakerDetail);

export const createSpeaker = (data) => callApi('speakers', 'POST', data, transformSpeakerSummary);

export const updateSpeaker = (speakerId, data) => callApi(`speakers/${speakerId}`, 'PUT', data, transformSpeakerSummary);

//export const deleteSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'DELETE');
