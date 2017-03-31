import { observable, action } from 'mobx';
import { getDocument, updateDocument } from '../../services/api/documents';
import { getSpeakers } from '../../services/api/speakers';

class EditDocumentStore {

    notificationsStore;
    documentsStore;

    @observable isVisible = false;
    @observable documentId = null;
    @observable isLoading = false;
    cancelLoading = null;
    @observable formData = {
        title: '',
        date: '',
        speaker: null,
        textContent: ''
    };
    @observable formErrors = {
        title: '',
        date: '',
        speaker: '',
        textContent: ''
    };
    @observable speakerOptions = [];
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, documentsStore) {
        this.notificationsStore = notificationsStore;
        this.documentsStore = documentsStore;
    }

    @action.bound
    show(documentId) {

        this.isVisible = true;
        this.documentId = documentId;

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
            title: '',
            date: '',
            speaker: null,
            textContent: ''
        };
        this.formErrors = {
            title: '',
            date: '',
            speaker: '',
            textContent: ''
        };
        this.speakerOptions = [];
        Promise.all([ getDocument(this.documentId), getSpeakers() ])
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                const [document, speakers] = data;
                const { title, date, speakerId, speakerName, textContent } = document;
                this.formData = {
                    title,
                    date,
                    speaker: { value: speakerId, label: speakerName },
                    textContent
                };
                this.speakerOptions = speakers.map((speaker) => ({
                    value: speaker.id,
                    label: speaker.name
                }));
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
                this.isLoading = false;
                this.cancelLoading = null;
            });
    }

    @action.bound
    setFormData(name, value) {

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

        const { title, date, speaker, textContent } = this.formData;

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
            }
        };

        this.isSubmitting = true;
        updateDocument(this.documentId, data)
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                this.documentsStore.addOrUpdateDocument(data);
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
                this.cancelSubmitting = null;
            });
    }
}

export default EditDocumentStore;
