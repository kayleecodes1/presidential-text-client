import { observable, action } from 'mobx';
import { getDocuments, searchDocuments } from '../../services/api/documents';
import { createReport } from '../../services/api/reports';

function dateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

function getDocumentIdsForFilterSet(filterSet) {
    return new Promise((resolve, reject) => {

        getDocuments().then((documents) => {
            return documents
                .filter((document) => {
                    const { title, startDate, endDate, speakers } = filterSet.filters;
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
                    return true;
                });
        }).then((documents) => {
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
        }).then((documents) => {
            resolve(documents.map((document) => document.id));
        })
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

        const { analytic, filterSets } = this.formData;

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
                    collections[collectionData.name] = { documents: collectionData.documentIds };
                }
                const data = { analytic, collections };
console.log(analytic);
                createReport(data)
                    .then((result) => {
                        if (isCancelled) {
                            return;
                        }
                        this.reportsStore.setResult(result);
                        this.hide();
                    })
                    .catch((error) => {
                        if (isCancelled) {
                            return;
                        }
                        this.notificationsStore.addNotification('error', `Error: ${error}`);
                    })
                    .then(() => {
                        if (isCancelled) {
                            return;
                        }
                        this.isSubmitting = false;
                        this.cancelLoading = null;
                    });
            })
            .catch((error) => {
                if (isCancelled) {
                    return;
                }
                this.notificationsStore.addNotification('error', `Error: ${error}`);
                this.isSubmitting = false;
                this.cancelLoading = null;
            });
    }
}

export default CreateReportStore;
