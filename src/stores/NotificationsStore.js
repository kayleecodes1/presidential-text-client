import { observable, computed, action } from 'mobx';

const NOTIFICATION_DURATION = 3000;

class NotificationsStore {

    static nextNotificationId = 1;

    @observable notifications = new Map();

    @computed get currentNotifications() {
        return this.notifications.values().reverse();
    }

    @action.bound
    addNotification(notificationType, message) {

        const id = NotificationsStore.nextNotificationId++;
        const notification = {
            id,
            notificationType,
            message
        };

        this.notifications.set(id, notification);

        setTimeout(() => {
            this.hideNotification(id);
        }, NOTIFICATION_DURATION);
    }

    @action.bound
    hideNotification(notificationId) {

        this.notifications.delete(notificationId);
    }
}

export default NotificationsStore;
