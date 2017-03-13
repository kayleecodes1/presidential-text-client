import { observable } from 'mobx';

class DataModel {

    store;
    id;
    @observable text;
    @observable date;
    @observable speakerId;
    @observable customLabels;

    constructor(store, id, title, text, date, speakerId, customLabels) {

        this.store = store;
        this.id = id;
        this.title = title;
        this.text = text;
        this.date = date;
        this.speakerId = speakerId;
        this.customLabels = {};
        for (const labelName of Object.keys(customLabels)) {
            this.customLabels[labelName] = customLabels[labelName];
        }
    }

    serialize() {

        const { id, title, text, date, speakerId, customLabels } = this;
        return {
            id,
            title,
            text,
            date,
            speakerId,
            ...customLabels
        };
    }

    update({ title, text, date, speakerId, ...customLabels }) {

        this.title = title;
        this.text = text;
        this.date = date;
        this.speakerId = speakerId;
        for (const labelName of Object.keys(customLabels)) {
            this.customLabels[labelName] = customLabels[labelName];
        }
    }

    delete() {

        this.store.data.remove(this);
    }
}

export default DataModel;
