import { observable, computed, action } from 'mobx';
import moment from 'moment';

const STORAGE_KEY = 'pt::filterSets';

class FilterSetsStore {

    @observable filterSets = new Map();

    @computed get currentFilterSets() {
        return this.filterSets
            .values()
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    constructor() {

        let json = window.localStorage.getItem(STORAGE_KEY);
        if (!json) {
            json = JSON.stringify([]);
            window.localStorage.setItem(STORAGE_KEY, json);
        }
        const filterSets = JSON.parse(json);
        for (const filterSet of filterSets) {
            this.filterSets.set(filterSet.name, {
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
            });
        }
    }

    persistToLocalStorage() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentFilterSets));
    }

    @action.bound
    createOrUpdateFilterSet(name, filters) {
        this.filterSets.set(name, { name, filters });
        this.persistToLocalStorage();
    }

    @action.bound
    getFilterSet(name) {
        return this.filterSets.get(name);
    }

    @action.bound
    deleteFilterSet(name) {
        this.filterSets.delete(name);
        this.persistToLocalStorage();
    }
}

export default FilterSetsStore;
