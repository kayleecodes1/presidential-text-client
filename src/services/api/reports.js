import { callApi } from './util.js';

export const createReport = (data) => callApi('analyze', 'POST', data);
