import { observable, action } from 'mobx';
import { deleteSpeaker } from '../../services/api/speakers';

class DeleteSpeakerStore {

    notificationsStore;
    speakersStore;

    @observable isVisible = false;
    @observable speakerId = null;
    @observable isSubmitting = false;

    constructor(notificationsStore, speakersStore) {
        this.notificationsStore = notificationsStore;
        this.speakersStore = speakersStore;
    }

    @action.bound
    show(speakerId) {
        this.isVisible = true;
        this.speakerId = speakerId;
    }

    @action.bound
    hide() {
        this.isVisible = false;
    }

    submit() {
        this.isSubmitting = true;
        deleteSpeaker(this.documentId)
            .then(() => {
                this.speakersStore.removeSpeaker(this.speakerId);
                this.hide();
            })
            .catch((error) => {
                this.notificationsStore.addNotification('error', `Error: ${error}`);
            })
            .then(() => {
                this.isSubmitting = false;
            });
    }
}

export default DeleteSpeakerStore;
