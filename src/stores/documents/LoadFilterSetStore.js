import { observable, action } from 'mobx';
import moment from 'moment';

class LoadFilterSetStore {

    filterSetsStore;
    documentsStore;

    @observable isVisible = false;
    @observable formData = {
        filterSet: null
    };
    @observable formErrors = {
        filterSet: null
    };

    constructor(filterSetsStore, documentsStore) {
        this.filterSetsStore = filterSetsStore;
        this.documentsStore = documentsStore;
    }

    @action.bound
    show() {
        this.isVisible = true;
        this.formData.filterSet = null;
        this.formErrors.filterSet = null;
    }

    @action.bound
    setFormData(name, value) {
        this.formData[name] = value;
    }

    @action.bound
    hide() {
        this.isVisible = false;
    }

    submit() {

        const { filterSet } = this.formData;

        let hasErrors = false;
        if (filterSet === null) {
            hasErrors = true;
            this.formErrors.filterSet = 'A filter set is required.';
        }
        if (hasErrors) {
            return;
        }

        const filterSetData = this.filterSetsStore.getFilterSet(filterSet.key);
        this.documentsStore.loadFilterSet(filterSetData);
        this.hide();
    }

    submitImport(text) {

        const filterSet = JSON.parse(text);
        const filterSetData = {
            name: filterSet.name,
            filters: {
                title: filterSet.filters.title || '',
                startDate: (filterSet.filters.startDate && moment(filterSet.filters.startDate)) || null,
                endDate: (filterSet.filters.endDate && moment(filterSet.filters.endDate)) || null,
                speakers: filterSet.filters.speakers || [],
                textContent: filterSet.filters.textContent || '',
                documentLabels: filterSet.filters.documentLabels || [],
                speakerLabels: filterSet.filters.speakerLabels || []
            }
        };
        this.documentsStore.loadFilterSet(filterSetData);
        this.hide();
    }
}

export default LoadFilterSetStore;
