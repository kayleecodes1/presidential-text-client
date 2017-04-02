import { observable, computed, action } from 'mobx';
import { getDocuments } from '../../services/api/documents';
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

    @observable resultsPerPage = 10;
    @observable currentPage = 1;
    @observable isLoading = false;
    cancelLoading = null;
    @observable documents = new Map();
    @observable speakerOptions = [];

    @observable filters = {
        title: '',
        startDate: null,
        endDate: null,
        speakers: []
    };

    @observable sortAttribute = 'title';
    @observable sortOrder = 1;

    @computed get currentDocuments() {
        return this.documents
            .values()
            .filter((document) => {
                const { title, startDate, endDate, speakers } = this.filters;
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
                return true;
            })
            .sort((a, b) => {
                return a[this.sortAttribute].localeCompare(b[this.sortAttribute]) * (this.sortOrder === 1 ? 1 : -1);
            });
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
        const { title, startDate, endDate, speakers } = this.filters;
        return title === '' && startDate === null && endDate === null && speakers.length === 0;

    }

    @computed get currentPageDocuments() {
        return this.currentDocuments
            .slice(this.firstResultNumber - 1, this.lastResultNumber);
    }

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
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
        this.speakerOptions.clear();
        this.clearFilters();
        this.sortAttribute = 'title';
        this.sortOrder = 1;

        Promise.all([getDocuments(), getSpeakers()])
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                const [documents, speakers] = data;
                const newDocuments = new Map();
                for (const document of documents) {
                    newDocuments.set(document.id, document);
                }
                this.documents.replace(newDocuments);
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
    setFilterData(name, value) {
        if (name === 'speakers') {
            this.filters.speakers.replace(value);
            return;
        }
        this.filters[name] = value;
    }

    @action.bound
    clearFilters() {
        this.filters.title = '';
        this.filters.startDate = null;
        this.filters.endDate = null;
        this.filters.speakers.clear();
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
