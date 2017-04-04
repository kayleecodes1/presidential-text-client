import { observable, action } from 'mobx';

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
}

export default LoadFilterSetStore;
