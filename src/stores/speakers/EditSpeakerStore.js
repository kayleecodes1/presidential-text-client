import { observable, action, runInAction, toJS } from 'mobx';
import { getSpeaker, updateSpeaker } from '../../services/api/speakers';

class EditSpeakerStore {

    notificationsStore;
    speakersStore;

    @observable isVisible = false;
    @observable speakerId = null;
    @observable isLoading = false;
    cancelLoading = null;
    @observable formData = {
        name: '',
        labels: []
    };
    @observable terms = [];
    @observable formErrors = {
        name: '',
        terms: ''
    };
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, speakersStore) {
        this.notificationsStore = notificationsStore;
        this.speakersStore = speakersStore;
    }

    @action.bound
    show(speakerId) {

        this.isVisible = true;
        this.speakerId = speakerId;

        if (this.cancelLoading) {
            this.cancelLoading();
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
            this.cancelLoading = null;
        };

        this.isLoading = true;
        this.formData = {
            name: '',
            labels: []
        };
        this.terms.clear();
        this.formErrors = {
            name: '',
            terms: ''
        };
        getSpeaker(this.speakerId)
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    const {speakerLabelOptions} = this.speakersStore;
                    const {name, terms, labels} = data;
                    this.formData = {
                        name,
                        labels: labels.map((label) => {
                            const storedLabel = speakerLabelOptions.find((storedLabel) => storedLabel.id === label.id);
                            return {
                                value: label.id,
                                label: storedLabel ? storedLabel.tag : null
                            };
                        })
                    };
                    this.terms.replace(terms);
                });
            })
            .catch((error) => {
                if (isCancelled) {
                    return;
                }
                this.notificationsStore.addNotification('error', `Error: ${error}`);
                this.hide();
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
    setFormData(name, value) {

        if (name === 'labels') {
            this.formData[name].replace(value);
            return;
        }
        this.formData[name] = value;
    }

    @action.bound
    setTermData(index, name, value) {

        this.terms[index][name] = value;
    }

    @action.bound
    addTerm() {

        this.terms.push({
            startDate: '',
            endDate: ''
        });
    }

    @action.bound
    removeTerm(index) {

        this.terms.remove(this.terms[index]);
    }

    @action.bound
    hide() {
        this.isVisible = false;
        //TODO: cancel loading or submitting if in progress
    }

    @action.bound
    submit() {

        if (this.isSubmitting) {
            return;
        }

        const { name, labels } = this.formData;
        const terms = this.terms.peek().map((o) => toJS(o));

        let hasErrors = false;
        this.formErrors.name = '';
        this.formErrors.terms = '';
        if (name === '') {
            hasErrors = true;
            this.formErrors.name = 'A name is required.';
        }
        for (const term of terms) {
            if (term.startDate.search(/^\d{4}-\d{1,2}-\d{1,2}$/) === -1 || term.endDate.search(/^\d{4}-\d{1,2}-\d{1,2}$/) === -1) {
                hasErrors = true;
                this.formErrors.terms = 'A valid date is required for all terms.';
                break;
            }
        }
        if (hasErrors) {
            return;
        }

        if (this.cancelSubmitting) {
            this.cancelSubmitting();
            this.cancelSubmitting = null;
        }

        let isCancelled = false;
        this.cancelSubmitting = () => {
            isCancelled = true;
        };

        const data = {
            name,
            terms,
            labels: labels.map((label) => ({
                speakerLabelId: label.value
            }))
        };

        this.isSubmitting = true;
        updateSpeaker(this.speakerId, data)
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.speakersStore.addOrUpdateSpeaker(data);
                    this.hide();
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
                    this.isSubmitting = false;
                    this.cancelSubmitting = null;
                });
            });
    }
}

export default EditSpeakerStore;
