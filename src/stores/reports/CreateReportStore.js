import { observable, action, runInAction } from 'mobx';
import { getDocuments, searchDocuments } from '../../services/api/documents';
import { getSpeakers } from '../../services/api/speakers';
import { createReport } from '../../services/api/reports';

function dateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}
//TODO: ......
function getDocumentIdsForFilterSet(filterSet) {
    return new Promise((resolve, reject) => {

        Promise.all([getDocuments(), getSpeakers()])
            .then((data) => {
                const [documents, allSpeakers] = data;
                const speakersLookup = new Map();
                for (const speaker of allSpeakers) {
                    speakersLookup.set(speaker.id, speaker);
                }
                return documents
                    .filter((document) => {
                        const { title, startDate, endDate, speakers, documentLabels, speakerLabels } = filterSet.filters;
                        if (title && document.title.search(new RegExp(title, 'i')) === -1) {
                            return false;
                        }
                        if (startDate && document.date < dateToString(new Date(startDate))) {
                            return false;
                        }
                        if (endDate && document.date > dateToString(new Date(endDate))) {
                            return false;
                        }
                        if (speakers.length && !speakers.some((selected) => document.speakerId === selected.value)) {
                            return false;
                        }
                        //TODO: FROM HERE
                        if (documentLabels.length && !documentLabels.some((selected) => document.labels.some((label) => label.id === selected.value))) {
                            return false;
                        }
                        if (speakerLabels.length && !speakerLabels.some((selected) => {
                            const speaker = speakersLookup.get(document.speakerId);
                            return speaker.labels.some((label) => label.id === selected.value);
                        })) {
                            return false;
                        }
                        return true;
                    });
            })
            .then((documents) => {
                if (filterSet.filters.textContent === '') {
                    return documents;
                }
                return searchDocuments(filterSet.filters.textContent)
                    .then((textSearchDocumentIds) => {
                        return documents.filter((document) => {
                            return textSearchDocumentIds.indexOf(document.id) !== -1;
                        });
                    });
                //TODO: catch
            })
            .then((documents) => {
                resolve(documents.map((document) => document.id));
            });
            //TODO: catch
    });
}

class CreateReportStore {

    notificationsStore;
    filterSetsStore;
    reportsStore;

    @observable isVisible = false;
    @observable formData = {
        analytic: '',
        clusterOption: 'single',
        filterSets: []
    };
    @observable formErrors = {
        analytic: '',
        filterSets: ''
    };
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, filterSetsStore, reportsStore) {
        this.notificationsStore = notificationsStore;
        this.filterSetsStore = filterSetsStore;
        this.reportsStore = reportsStore;
    }

    @action.bound
    show() {

        this.isVisible = true;

        this.formData = {
            analytic: '',
            clusterOption: 'single',
            filterSets: []
        };
        this.formErrors = {
            analytic: '',
            filterSets: ''
        };
    }

    @action.bound
    setFormData(name, value) {

        if (name === 'filterSets') {
            this.formData.filterSets.replace(value);
            return;
        }
        this.formData[name] = value;
    }

    @action.bound
    hide() {

        this.isVisible = false;
        //TODO: cancel loading or submitting if in progress
    }

    @action.bound
    submit() {

        if (this.isSubmitting) {
            return;
        }

        const { analytic, clusterOption, filterSets } = this.formData;

        let hasErrors = false;
        if (analytic === '') {
            hasErrors = true;
            this.formErrors.analytic = 'Report type is required.';
        }
        if (filterSets.length === 0) {
            hasErrors = true;
            this.formErrors.filterSets = 'At least one filter set is required.';
        }
        if (hasErrors) {
            return;
        }

        if (this.cancelSubmitting) {
            this.cancelSubmitting();
            this.cancelSubmitting = null;
        }

        let isCancelled = false;
        this.cancelSubmitting = () => {
            isCancelled = true;
        };

        this.reportsStore.clearResult();
        this.isSubmitting = true;

        const promises = [];
        for (const filterSetOption of filterSets) {
            promises.push(new Promise((resolve, reject) => {
                const filterSet = this.filterSetsStore.getFilterSet(filterSetOption.value);
                getDocumentIdsForFilterSet(filterSet)
                    .then((documentIds) => {
                        resolve({ name: filterSet.name, documentIds });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }));
        }

        Promise.all(promises)
            .then((collectionsData) => {
                if (isCancelled) {
                    return;
                }

                const collections = {};
                for (const collectionData of collectionsData) {
                    collections[collectionData.name] = collectionData.documentIds;
                }

                const data = { analytic, collections };
                if (analytic === 'cluster') {
                    data.option = clusterOption;
                }

                createReport(data)
                    .then((result) => {
                        if (isCancelled) {
                            return;
                        }

                        const { analytic, collections } = result;

                        if (analytic === 'cluster') {
                            const json = collections.result.cluster.json_tree;
                            const hierarchyData = JSON.parse(json.replace('\\"', '"'));
                            const _convertChildren = (children) => {
                                for (const child of children) {
                                    const documentTitles = child.name.split('-').map((idString) => {
                                        const documentId = parseInt(idString, 10);
                                        return this.reportsStore.getDocumentTitle(documentId);
                                    });
                                    delete child.name;
                                    child.documentTitles = documentTitles;
                                    if (child.children) {
                                        _convertChildren(child.children);
                                    }
                                }
                            }
                            _convertChildren(hierarchyData.children);
                            result = {
                                analytic,
                                collections,
                                result: hierarchyData
                            };
                            delete result.collections.result;
                        }

                        runInAction(() => {
                            this.reportsStore.setResult(result);
                            this.hide();
                        });
                    })
                    .catch((error) => {
                        if (isCancelled) {
                            return;
                        }
                        runInAction(() => {
                            this.notificationsStore.addNotification('error', `Error: ${error}`);
                        });
                    })
                    .then(() => {
                        if (isCancelled) {
                            return;
                        }
                        runInAction(() => {
                            this.isSubmitting = false;
                            this.cancelLoading = null;
                        });
                    });
            })
            .catch((error) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.notificationsStore.addNotification('error', `Error: ${error}`);
                    this.isSubmitting = false;
                    this.cancelLoading = null;
                });
            });
    }
}

export default CreateReportStore;
