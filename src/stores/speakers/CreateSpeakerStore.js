import { observable, action, toJS } from 'mobx';
import { createSpeaker } from '../../services/api/speakers';

class CreateSpeakerStore {

    notificationsStore;
    speakersStore;

    @observable isVisible = false;
    @observable formData = {
        name: ''
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
    show() {

        this.isVisible = true;

        this.formData = {
            name: ''
        };
        this.terms.clear();
        this.formErrors = {
            name: '',
            terms: ''
        };
    }

    @action.bound
    setFormData(name, value) {

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
        //TODO: cancel submitting if in progress
    }

    @action.bound
    submit() {

        if (this.isSubmitting) {
            return;
        }

        const { name } = this.formData;
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
            terms
        };

        this.isSubmitting = true;
        createSpeaker(data)
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                this.speakersStore.addOrUpdateSpeaker(data);
                this.hide();
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
                this.isSubmitting = false;
                this.cancelLoading = null;
            });
    }
}

export default CreateSpeakerStore;
