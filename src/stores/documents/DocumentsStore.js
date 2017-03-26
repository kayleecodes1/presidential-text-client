import { observable, computed, action } from 'mobx';
import { getDocuments } from '../../services/api/documents';

class DocumentsStore {

    notificationsStore;

    @observable resultsPerPage = 10;
    @observable currentPage = 1;
    @observable isLoadingDocuments = false;
    cancelLoading = null;
    @observable documents = new Map();

    @computed get totalResults() {
        if (!this.documents) {
            return 0;
        }
        return this.documents.size;
    }
    @computed get firstResultNumber() {
        if (!this.documents) {
            return 0;
        }
        return Math.min(this.documents.size, (this.currentPage - 1) * this.resultsPerPage + 1);
    }
    @computed get lastResultNumber() {
        if (!this.documents) {
            return 0;
        }
        return Math.min(this.documents.size, this.currentPage * this.resultsPerPage);
    }
    @computed get totalPages() {
        if (!this.documents) {
            return 0;
        }
        return Math.ceil(this.documents.size / this.resultsPerPage);
    }
    @computed get currentPageDocuments() {
        return this.documents.values().slice(this.firstResultNumber - 1, this.lastResultNumber);
    }

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
    }
    
    @action.bound
    getDocuments() {

        if (this.cancelLoading) {
            this.cancelLoading();
            this.cancelLoading = null;
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
        };

        this.isLoadingDocuments = true;
        this.documents.clear();
        getDocuments()
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                const documents = new Map();
                for (const document of data) {
                    documents.set(document.id, document);
                }
                this.documents.replace(documents);
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
                this.isLoadingDocuments = false;
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
