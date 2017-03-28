import { observable, action } from 'mobx';
import { createReport } from '../../services/api/reports';
import { getSpeakers } from '../../services/api/speakers';

class CreateReportStore {

    notificationsStore;
    reportsStore;

    @observable isVisible = false;
    @observable isLoading = false;
    cancelLoading = null;
    @observable speakerOptions = [];
    @observable reportType = '';
    @observable documentLists = [];
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, reportsStore) {
        this.notificationsStore = notificationsStore;
        this.reportsStore = reportsStore;
    }

    @action.bound
    show() {

        this.isVisible = true;

        if (this.cancelLoading) {
            this.cancelLoading();
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
            this.cancelLoading = null;
        };

        this.isLoading = true;
        this.reportType = '';
        this.documentLists.replace([{
            name: '',
            conditions: [{
                entityType: '',
                labelName: '',
                labelValue: ''
            }]
        }]);
        this.speakerOptions = [];
        getSpeakers()
            .then((data) => {
                if (isCancelled) {
                    return;
                }
                this.speakerOptions = data.map((speaker) => ({
                    value: speaker.id,
                    label: speaker.name,
                    terms: speaker.terms
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
    setReportType(value) {

        this.reportType = value;
    }

    @action.bound
    addDocumentList() {

        this.documentLists.push({
            name: '',
            conditions: [{
                entityType: '',
                labelName: '',
                labelValue: ''
            }]
        });
    }

    @action.bound
    setDocumentListValue(index, name, value) {

        this.documentLists[index][name] = value;
    }

    @action.bound
    removeDocumentList(index) {

        if (this.documentLists.length <= 1) {
            return;
        }

        this.documentLists.remove(this.documentLists[index]);
    }

    @action.bound
    addCondition(documentListIndex) {

        this.documentLists[documentListIndex].conditions.push({
            entityType: '',
            labelName: '',
            labelValue: ''
        });
    }

    @action.bound
    setConditionValue(documentListIndex, index, name, value) {

        this.documentLists[documentListIndex].conditions[index][name] = value;
    }

    @action.bound
    removeCondition(documentListIndex, index) {

        const documentList = this.documentLists[documentListIndex];

        if (documentList.conditions.length <= 1) {
            return;
        }

        documentList.conditions.remove(documentList.conditions[index]);
    }

    @action.bound
    hide() {

        this.isVisible = false;
        //TODO: cancel loading or submitting if in progress
    }

    @action.bound
    submit() {
//TODO
        if (this.isSubmitting) {
            return;
        }

        const { title, date, speaker, speakerTerm, textContent } = this.formData;

        let hasErrors = false;
        this.formErrors.title = '';
        this.formErrors.date = '';
        this.formErrors.speaker = '';
        this.formErrors.textContent = '';
        if (title === '') {
            hasErrors = true;
            this.formErrors.title = 'A title is required.';
        }
        if (date.search(/^\d{1,2}\/\d{1,2}\/\d{4}$/) === -1) {
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
            date,
            speakerId: speaker.value,
            speakerTerm,
            textContent
        };

        this.isSubmitting = true;
        createDocument(data)
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
                this.cancelLoading = null;
            });
    }
}

export default CreateReportStore;
