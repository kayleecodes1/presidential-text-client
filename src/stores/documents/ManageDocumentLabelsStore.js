import { observable, action, runInAction } from 'mobx';
import { createDocumentLabel, updateDocumentLabel } from '../../services/api/documentLabels';

class ManageDocumentLabelsStore {

    notificationsStore;
    documentsStore;

    @observable isVisible = false;
    @observable isEditing = false;
    @observable formData = {
        _labelId: null,
        key: '',
        value: ''
    };
    @observable formErrors = {
        key: '',
        value: ''
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
        this.isEditing = false;
        this.formData = {
            _labelId: null,
            key: '',
            value: ''
        };
        this.formErrors = {
            key: '',
            value: ''
        };
    }

    @action.bound
    addOrEditLabel(labelId = null) {

        this.isEditing = true;
        this.formData = {
            _labelId: labelId,
            key: '',
            value: ''
        };
        this.formErrors = {
            key: '',
            value: ''
        };

        if (labelId !== null) {
            const { currentDocumentLabels } = this.documentsStore;
            const label = currentDocumentLabels.find((label) => label.id === labelId);
            if (label) {
                this.formData.key = label.key;
                this.formData.value = label.value;
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

        const { _labelId, key, value } = this.formData;

        this.formErrors = {
            key: '',
            value: ''
        };
        let hasErrors = false;
        if (key === '') {
            hasErrors = true;
            this.formErrors.key = 'A key is required.';
        }
        if (value === '') {
            hasErrors = true;
            this.formErrors.value = 'A value is required.';
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
            key,
            value
        };

        this.isSubmitting = true;
        let promise;
        if (_labelId) {
            promise = updateDocumentLabel(_labelId, data);
        }
        else {
            promise = createDocumentLabel(data);
        }
        promise
            .then((label) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.documentsStore.addOrUpdateLabel(label);
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

export default ManageDocumentLabelsStore;
