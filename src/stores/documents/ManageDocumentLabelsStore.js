import { observable, computed, action } from 'mobx';
import { createDocumentLabel, getDocumentLabels, updateDocumentLabel } from '../../services/api/documentLabels';

class ManageDocumentLabelsStore {

    notificationsStore;

    @observable isVisible = false;
    @observable isLoading = false;
    cancelLoading = null;
    @observable labels = new Map();
    @observable isEditing = false;
    @observable formData = {
        _labelId: null,
        title: ''
    };
    @observable formErrors = {
        title: ''
    };
    @observable isSubmitting = false;
    cancelSubmitting = null;

    @computed get currentLabels() {
        return this.labels.values();
    }

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
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
        this.labels.clear();
        this.isEditing = false;
        this.formData = {
            _labelId: null,
            title: ''
        };
        this.formErrors = {
            title: ''
        };
        getDocumentLabels()
            .then((labels) => {
                if (isCancelled) {
                    return;
                }
                this.labels.clear();
                for (const label of labels) {
                    this.labels.set(label.id, label);
                }
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
    addOrEditLabel(labelId = null) {

        this.isEditing = true;
        this.formData = {
            _labelId: labelId,
            title: ''
        };

        if (labelId !== null) {
            const label = this.labels.find((label) => label.id === labelId);
            if (label) {
                this.formData.title = label.title;
            }
        }
    }

    @action.bound
    cancelAddOrEditLabel() {

        this.isEditing = false;
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

        const { _labelId, title } = this.formData;

        let hasErrors = false;
        if (title === '') {
            hasErrors = true;
            this.formErrors.title = 'A title is required.';
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
            title
        };

        this.isSubmitting = true;
        let promise;
        if (_labelId) {
            promise = createDocumentLabel(data);
        }
        else {
            promise = updateDocumentLabel(_labelId, data);
        }
        promise
            .then((label) => {
                if (isCancelled) {
                    return;
                }
                this.labels.set(label.id, label);
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

export default ManageDocumentLabelsStore;
