import { callApi } from './util.js';

const TEST_SPEAKERS = [{
    id: 1,
    name: 'George Washington',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 2,
    name: 'John Adams',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 3,
    name: 'Thomas Jefferson',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 4,
    name: 'James Madison',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 5,
    name: 'James Monroe',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 6,
    name: 'John Quincy Adams',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 7,
    name: 'Andrew Jackson',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 8,
    name: 'Martin Van Buren',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 9,
    name: 'William Henry Harrison',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}, {
    id: 10,
    name: 'John Tyler',
    terms: [{
        startDate: '01/01/1900',
        endDate: '01/01/2000'
    }]
}];
let nextId = TEST_SPEAKERS.length + 1;

function getSpeakerById(speakerId) {
    for (const speaker of TEST_SPEAKERS) {
        if (speaker.id === speakerId) {
            return speaker;
        }
    }
    return null;
}

function createNewSpeakerSummary(speakerId, data) {

    return {
        id: speakerId || nextId++,
        name: data.name,
        terms: data.terms
    };
}

export const createSpeaker = (data) => callApi('speakers', 'POST', data, () => {
    return Promise.resolve(createNewSpeakerSummary(null, data));
});
export const getSpeakers = () => callApi('speakers', 'GET', null, () => {
    return Promise.resolve(TEST_SPEAKERS);
});
export const getSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'GET', null, () => {
    return Promise.resolve(getSpeakerById(speakerId));
});
export const updateSpeaker = (speakerId, data) => callApi(`speakers/${speakerId}`, 'PUT', data, () => {
    return Promise.resolve(createNewSpeakerSummary(speakerId, data))
});
export const deleteSpeaker = (speakerId) => callApi(`speakers/${speakerId}`, 'DELETE', null, () => {
    return Promise.resolve();
});
