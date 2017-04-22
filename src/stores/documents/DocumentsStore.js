import { observable, computed, action, toJS } from 'mobx';
import moment from 'moment';
import { getDocuments, searchDocuments } from '../../services/api/documents';
import { getDocumentLabels } from '../../services/api/documentLabels';
import { getSpeakers } from '../../services/api/speakers';

function dateToString(date) {
    date = date.toDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

class DocumentsStore {

    notificationsStore;
    filterSetsStore;

    @observable resultsPerPage = 10;
    @observable currentPage = 1;
    @observable isLoading = false;
    cancelLoading = null;
    @observable documents = new Map();
    @observable documentLabelOptions = [];
    @observable speakerOptions = [];

    @observable filterSetName = '';
    @observable filters = {
        title: '',
        startDate: null,
        endDate: null,
        speakers: [],
        textContent: '',
        labels: []
    };
    @observable textSearchIsLoading = false;
    textSearchTimeoutId = null;
    cancelTextSearchLoading = null;
    @observable textSearchDocumentIds = [];

    @observable sortAttribute = 'title';
    @observable sortOrder = 1;

    @computed get currentDocuments() {
        let currentDocuments = this.documents.values();
        if (this.filters.textContent !== '') {
            currentDocuments = currentDocuments.filter((document) => {
                return this.textSearchDocumentIds.indexOf(document.id) !== -1;
            });
        }
        currentDocuments = currentDocuments
            .filter((document) => {
                const { title, startDate, endDate, speakers, labels } = this.filters;
                if (title && document.title.search(new RegExp(title, 'i')) === -1) {
                    return false;
                }
                if (startDate && document.date < dateToString(startDate)) {
                    return false;
                }
                if (endDate && document.date > dateToString(endDate)) {
                    return false;
                }
                if (speakers.length && !speakers.some((selected) => document.speakerId === selected.value)) {
                    return false;
                }
                if (labels.length && !labels.some((selected) => document.labels.some((label) => label.id === selected.value))) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                return a[this.sortAttribute].localeCompare(b[this.sortAttribute]) * (this.sortOrder === 1 ? 1 : -1);
            });
        return currentDocuments;
    }

    @computed get totalResults() {
        if (!this.documents) {
            return 0;
        }
        return this.currentDocuments.length;
    }
    @computed get firstResultNumber() {
        if (!this.documents) {
            return 0;
        }
        return Math.min(this.currentDocuments.length, (this.currentPage - 1) * this.resultsPerPage + 1);
    }
    @computed get lastResultNumber() {
        if (!this.documents) {
            return 0;
        }
        return Math.min(this.currentDocuments.length, this.currentPage * this.resultsPerPage);
    }
    @computed get totalPages() {
        if (!this.documents) {
            return 0;
        }
        return Math.ceil(this.currentDocuments.length / this.resultsPerPage);
    }

    @computed get filtersAreEmpty() {
        const { title, startDate, endDate, speakers, textContent, labels } = this.filters;
        return title === '' &&
            startDate === null &&
            endDate === null &&
            speakers.length === 0 &&
            textContent === '' &&
            labels.length === 0;
    }

    @computed get filterSetIsDirty() {

        if (this.filterSetName === '') {
            return false;
        }

        if (this.filtersAreEmpty) {
            return false;
        }

        const filterSet = this.filterSetsStore.getFilterSet(this.filterSetName);

        if (!filterSet) {
            return true;
        }

        if (filterSet.filters.title === this.filters.title &&
            filterSet.filters.startDate === JSON.parse(JSON.stringify(this.filters.startDate)) &&
            filterSet.filters.endDate === JSON.parse(JSON.stringify(this.filters.endDate)) &&
            filterSet.filters.speakers.toString() === this.filters.speakers.toString() &&
            filterSet.filters.textContent === this.filters.textContent &&
            filterSet.filters.labels.toString() === this.filters.labels.toString())
        {
            return false;
        }

        return true;
    }

    @computed get currentPageDocuments() {
        return this.currentDocuments
            .slice(this.firstResultNumber - 1, this.lastResultNumber);
    }

    @computed get currentFilterSetExists() {
        return Boolean(this.filterSetsStore.getFilterSet(this.filterSetName));
    }

    constructor(notificationsStore, filterSetsStore) {
        this.notificationsStore = notificationsStore;
        this.filterSetsStore = filterSetsStore;
    }
    
    @action.bound
    initializeState() {

        if (this.cancelLoading) {
            this.cancelLoading();
            this.cancelLoading = null;
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
        };

        this.resultsPerPage = 10;
        this.currentPage = 1;
        this.isLoading = true;
        this.documents.clear();
        this.documentLabelOptions.clear();
        this.speakerOptions.clear();
        this.clearFilters();
        this.sortAttribute = 'title';
        this.sortOrder = 1;

        Promise.all([getDocuments(), getDocumentLabels(), getSpeakers()])
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                const [documents, documentLabels, speakers] = data;
                this.documents.clear();
                for (const document of documents) {
                    this.documents.set(document.id, document);
                }
                this.documentLabelOptions.replace(documentLabels.map((label) => ({
                    value: label.id,
                    label: label.title
                })));
                this.speakerOptions.replace(speakers.map((speaker) => ({
                    value: speaker.id,
                    label: speaker.name
                })));
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
                this.isLoading = false;
                this.cancelLoading = null;
            });
    }

    @action.bound
    setResultsPerPage(resultsPerPage) {

        const oldFirstIndex = this.firstResultNumber - 1;
        this.resultsPerPage = resultsPerPage;
        // Set the current page to the page on which the first result for the
        // old results per page value is.
        this.currentPage = Math.floor(oldFirstIndex / resultsPerPage) + 1;
    }

    @action.bound
    goToPage(pageNumber) {
        this.currentPage = Math.max(1, Math.min(this.totalPages, pageNumber));
    }

    @action.bound
    goToPreviousPage() {
        this.goToPage(this.currentPage - 1);
    }

    @action.bound
    goToNextPage() {
        this.goToPage(this.currentPage + 1);
    }

    @action.bound
    setFilterSetName(value) {

        this.filterSetName = value;
    }

    @action.bound
    setFilterData(name, value) {

        if (name === 'speakers' || name === 'labels') {
            this.filters[name].replace(value);
            return;
        }
        this.filters[name] = value;
        if (name === 'textContent') {
            this.debounceLoadTextContentDocumentIds(value);
        }
    }

    @action.bound
    loadFilterSet(filterSet) {

        this.filterSetName = filterSet.name;
        const { title, startDate, endDate, speakers, textContent, labels } = filterSet.filters;
        this.setFilterData('title', title || '');
        this.setFilterData('startDate', startDate && moment(startDate));
        this.setFilterData('endDate', endDate && moment(endDate));
        this.setFilterData('speakers', speakers || []);
        this.setFilterData('textContent', textContent || '');
        this.setFilterData('labels', labels || []);
    }

    @action.bound
    saveFilterSet() {

        const filters = toJS(this.filters);
        if (filters.startDate !== null) {
            filters.startDate = JSON.parse(JSON.stringify(filters.startDate));
        }
        if (filters.endDate !== null) {
            filters.endDate = JSON.parse(JSON.stringify(filters.endDate));
        }
        this.filterSetsStore.createOrUpdateFilterSet(this.filterSetName, filters);
    }

    @action.bound
    deleteFilterSet() {

        this.filterSetsStore.deleteFilterSet(this.filterSetName);
        this.clearFilters();
    }

    debounceLoadTextContentDocumentIds(value) {

        if (this.textSearchTimeoutId) {
            clearTimeout(this.textSearchTimeoutId);
            this.textSearchTimeoutId = null;
        }

        if (this.cancelTextSearchLoading) {
            this.cancelTextSearchLoading();
            this.cancelTextSearchLoading = null;
        }

        if (value === '') {
            this.textSearchDocumentIds.clear();
            this.textSearchIsLoading = false;
            return;
        }

        this.textSearchIsLoading = true;
        this.textSearchTimeoutId = setTimeout(() => {

            let isCancelled = false;
            this.cancelTextSearchLoading = () => {
                isCancelled = true;
            };

            searchDocuments(value)
                .then((documentIds) => {
                    if (isCancelled) {
                        return;
                    }
                    this.textSearchDocumentIds.replace(documentIds);
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
                    this.textSearchIsLoading = false;
                    this.cancelTextSearchLoading = null;
                });
        }, 300);
    }

    @action.bound
    clearFilters() {

        this.filterSetName = '';
        this.filters.title = '';
        this.filters.startDate = null;
        this.filters.endDate = null;
        this.filters.speakers.clear();
        this.filters.textContent = '';
        this.filters.labels.clear();
    }

    @action.bound
    setSortAttribute(attribute) {
        if (attribute === this.sortAttribute) {
            this.sortOrder = this.sortOrder === 1 ? -1 : 1;
            return;
        }
        this.sortAttribute = attribute;
        this.sortOrder = 1;
    }

    @action.bound
    addOrUpdateDocument(document) {
        this.documents.set(document.id, document);
    }

    @action.bound
    removeDocument(documentId) {
        this.documents.delete(documentId);
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
    }
}

export default DocumentsStore;
