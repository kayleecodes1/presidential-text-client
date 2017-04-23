import { observable, action, runInAction } from 'mobx';
import { createSpeakerLabel, updateSpeakerLabel } from '../../services/api/speakerLabels';

class ManageSpeakerLabelsStore {

    notificationsStore;
    speakersStore;

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

    constructor(notificationsStore, speakersStore) {
        this.notificationsStore = notificationsStore;
        this.speakersStore = speakersStore;
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
            const { currentSpeakerLabels } = this.speakersStore;
            const label = currentSpeakerLabels.find((label) => label.id === labelId);
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
            promise = updateSpeakerLabel(_labelId, data);
        }
        else {
            promise = createSpeakerLabel(data);
        }
        promise
            .then((label) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.speakersStore.addOrUpdateLabel(label);
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

export default ManageSpeakerLabelsStore;
