import { observable, computed, action, runInAction, toJS } from 'mobx';
import moment from 'moment';
import FileSaver from 'file-saver';
import { getDocuments, searchDocuments } from '../../services/api/documents';
import { getDocumentLabels } from '../../services/api/documentLabels';
import { getSpeakers } from '../../services/api/speakers';
import { getSpeakerLabels } from '../../services/api/speakerLabels';

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
    @observable documentLabels = new Map();
    @observable speakers = new Map();
    @observable speakerLabels = new Map();

    @observable filterSetName = '';
    @observable filters = {
        title: '',
        startDate: null,
        endDate: null,
        speakers: [],
        textContent: '',
        documentLabels: [],
        speakerLabels: []
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
                const { title, startDate, endDate, speakers, documentLabels, speakerLabels } = this.filters;
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
                if (documentLabels.length && !documentLabels.some((selected) => document.labels.some((label) => label.id === selected.value))) {
                    return false;
                }
                if (speakerLabels.length && !speakerLabels.some((selected) => {
                    const speaker = this.speakers.get(document.speakerId);
                    return speaker.labels.some((label) => label.id === selected.value);
                })) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                return a[this.sortAttribute].localeCompare(b[this.sortAttribute]) * (this.sortOrder === 1 ? 1 : -1);
            });
        return currentDocuments;
    }

    @computed get currentDocumentLabels() {
        return this.documentLabels.values()
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }

    @computed get documentLabelOptions() {
        return this.currentDocumentLabels
            .map((label) => ({ value: label.id, label: label.tag }));
    }

    @computed get currentSpeakers() {
        return this.speakers.values()
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    @computed get speakerOptions() {
        return this.currentSpeakers
            .map((speaker) => ({ value: speaker.id, label: speaker.name }));
    }

    @computed get currentSpeakerLabels() {
        return this.speakerLabels.values()
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }

    @computed get speakerLabelOptions() {
        return this.currentSpeakerLabels
            .map((label) => ({ value: label.id, label: label.tag }));
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
        const { title, startDate, endDate, speakers, textContent, documentLabels, speakerLabels } = this.filters;
        return title === '' &&
            startDate === null &&
            endDate === null &&
            speakers.length === 0 &&
            textContent === '' &&
            documentLabels.length === 0 &&
            speakerLabels.length === 0;
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
            JSON.parse(JSON.stringify(filterSet.filters.startDate)) === JSON.parse(JSON.stringify(this.filters.startDate)) &&
                JSON.parse(JSON.stringify(filterSet.filters.endDate)) === JSON.parse(JSON.stringify(this.filters.endDate)) &&
            filterSet.filters.speakers.toString() === this.filters.speakers.toString() &&
            filterSet.filters.textContent === this.filters.textContent &&
            filterSet.filters.documentLabels.toString() === this.filters.documentLabels.toString() &&
            filterSet.filters.speakerLabels.toString() === this.filters.speakerLabels.toString())
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
        this.documentLabels.clear();
        this.speakers.clear();
        this.speakerLabels.clear();
        this.clearFilters();
        this.sortAttribute = 'title';
        this.sortOrder = 1;

        Promise.all([getDocuments(), getDocumentLabels(), getSpeakers(), getSpeakerLabels()])
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    const [documents, documentLabels, speakers, speakerLabels] = data;
                    this.documents.clear();
                    for (const document of documents) {
                        this.documents.set(document.id, document);
                    }
                    this.documentLabels.clear();
                    for (const label of documentLabels) {
                        this.documentLabels.set(label.id, label);
                    }
                    this.speakers.clear();
                    for (const speaker of speakers) {
                        this.speakers.set(speaker.id, speaker);
                    }
                    this.speakerLabels.clear();
                    for (const label of speakerLabels) {
                        this.speakerLabels.set(label.id, label);
                    }
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
                    this.isLoading = false;
                    this.cancelLoading = null;
                });
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

        if (name === 'speakers' || name === 'documentLabels' || name === 'speakerLabels') {
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
        const { title, startDate, endDate, speakers, textContent, documentLabels, speakerLabels } = filterSet.filters;
        this.setFilterData('title', title);
        this.setFilterData('startDate', startDate);
        this.setFilterData('endDate', endDate);
        this.setFilterData('speakers', speakers);
        this.setFilterData('textContent', textContent);
        this.setFilterData('documentLabels', documentLabels);
        this.setFilterData('speakerLabels', speakerLabels);
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

    @action.bound
    exportFilterSet() {
        
        const filters = toJS(this.filters);
        if (filters.startDate !== null) {
            filters.startDate = JSON.parse(JSON.stringify(filters.startDate));
        }
        if (filters.endDate !== null) {
            filters.endDate = JSON.parse(JSON.stringify(filters.endDate));
        }
        const data = {
            name: this.filterSetName,
            filters
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const nameSlug = data.name.replace(/[ \t]+/g, '-').toLowerCase();
        const filename = `filter-set__${nameSlug || 'untitled'}.json`;
        FileSaver.saveAs(blob, filename);
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
                    runInAction(() => {
                        this.textSearchDocumentIds.replace(documentIds);
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
                        this.textSearchIsLoading = false;
                        this.cancelTextSearchLoading = null;
                    });
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
        this.filters.documentLabels.clear();
        this.filters.speakerLabels.clear();
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

    @action.bound
    addOrUpdateLabel(label) {
        this.documentLabels.set(label.id, label);
    }
}

export default DocumentsStore;
