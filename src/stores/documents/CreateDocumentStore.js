import { observable, action, runInAction } from 'mobx';
import { createDocument } from '../../services/api/documents';

class CreateDocumentStore {

    notificationsStore;
    documentsStore;

    @observable isVisible = false;
    @observable formData = {
        title: '',
        date: '',
        speaker: null,
        textContent: '',
        labels: []
    };
    @observable formErrors = {
        title: '',
        date: '',
        speaker: '',
        textContent: ''
    };
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, documentsStore) {
        this.notificationsStore = notificationsStore;
        this.documentsStore = documentsStore;
    }

    @action.bound
    show() {

        this.isVisible = true;

        this.formData = {
            title: '',
            date: '',
            speaker: null,
            textContent: '',
            labels: []
        };
        this.formErrors = {
            title: '',
            date: '',
            speaker: '',
            textContent: ''
        };
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
    hide() {

        this.isVisible = false;
        //TODO: cancel loading or submitting if in progress
    }

    @action.bound
    submit() {

        if (this.isSubmitting) {
            return;
        }

        const { title, date, speaker, textContent, labels } = this.formData;

        let hasErrors = false;
        this.formErrors.title = '';
        this.formErrors.date = '';
        this.formErrors.speaker = '';
        this.formErrors.textContent = '';
        if (title === '') {
            hasErrors = true;
            this.formErrors.title = 'A title is required.';
        }
        if (date.search(/^\d{4}-\d{1,2}-\d{1,2}$/) === -1) {
            hasErrors = true;
            this.formErrors.date = 'A valid date is required.';
        }
        if (speaker === null) {
            hasErrors = true;
            this.formErrors.speaker = 'A speaker is required.';
        }
        if (textContent === '') {
            hasErrors = true;
            this.formErrors.textContent = 'Text content is required.';
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
            title,
            deliveryDate: date,
            fullText: textContent,
            speaker: {
                speakerId: speaker.value
            },
            labels: labels.map((label) => ({
                documentLabelId: label.value
            }))
        };

        this.isSubmitting = true;
        createDocument(data)
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.documentsStore.addOrUpdateDocument(data);
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

export default CreateDocumentStore;
