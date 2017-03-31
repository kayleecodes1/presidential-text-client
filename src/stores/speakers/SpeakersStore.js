import { observable, computed, action } from 'mobx';
import { getSpeakers } from '../../services/api/speakers';

class SpeakersStore {

    notificationsStore;

    @observable resultsPerPage = 10;
    @observable currentPage = 1;
    @observable isLoadingSpeakers = false;
    cancelLoading = null;
    @observable speakers = new Map();

    @observable sortAttribute = 'name';
    @observable sortOrder = 1;

    @computed get totalResults() {
        if (!this.speakers) {
            return 0;
        }
        return this.speakers.size;
    }
    @computed get firstResultNumber() {
        if (!this.speakers) {
            return 0;
        }
        return Math.min(this.speakers.size, (this.currentPage - 1) * this.resultsPerPage + 1);
    }
    @computed get lastResultNumber() {
        if (!this.speakers) {
            return 0;
        }
        return Math.min(this.speakers.size, this.currentPage * this.resultsPerPage);
    }
    @computed get totalPages() {
        if (!this.speakers) {
            return 0;
        }
        return Math.ceil(this.speakers.size / this.resultsPerPage);
    }
    @computed get currentPageSpeakers() {
        return this.speakers
            .values()
            .sort((a, b) => {
                return a[this.sortAttribute].localeCompare(b[this.sortAttribute]) * (this.sortOrder === 1 ? 1 : -1);
            })
            .slice(this.firstResultNumber - 1, this.lastResultNumber);
    }

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
    }
    
    @action.bound
    getSpeakers() {

        if (this.cancelLoading) {
            this.cancelLoading();
            this.cancelLoading = null;
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
        };

        this.isLoadingSpeakers = true;
        this.speakers.clear();
        getSpeakers()
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                const speakers = new Map();
                for (const speaker of data) {
                    speakers.set(speaker.id, speaker);
                }
                this.speakers.replace(speakers);
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
                this.isLoadingSpeakers = false;
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
    setSortAttribute(attribute) {
        if (attribute === this.sortAttribute) {
            this.sortOrder = this.sortOrder === 1 ? -1 : 1;
            return;
        }
        this.sortAttribute = attribute;
        this.sortOrder = 1;
    }

    @action.bound
    addOrUpdateSpeaker(speaker) {
        this.speakers.set(speaker.id, speaker);
    }

    @action.bound
    removeSpeaker(speakerId) {
        this.speakers.delete(speakerId);
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
    }
}

export default SpeakersStore;
