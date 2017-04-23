import { observable, computed, action } from 'mobx';

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
            this.filterSets.set(filterSet.name, filterSet);
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
