import { observable, action, runInAction } from 'mobx';
import { getDocuments } from '../../services/api/documents';

class ReportsStore {

    notificationsStore;

    @observable isLoading = false;
    cancelLoading = null;
    @observable documents = new Map();
    @observable result = null;

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
    }

    @action.bound
    initializeState() {

        if (this.cancelLoading) {
            this.cancelLoading();
            this.cancelLoading = null;
        }

        let isCancelled = false;
        this.cancelLoading = () => {
            isCancelled = true;
        };

        this.result = null;
        this.documents.clear();

        getDocuments()
            .then((documents) => {
                if (isCancelled) {
                    return;
                }
                runInAction(() => {
                    this.documents.clear();
                    for (const document of documents) {
                        this.documents.set(document.id, document);
                    }
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
                    this.isLoading = false;
                    this.cancelLoading = null;
                });
            });
    }

    @action.bound
    clearResult() {
        this.result = null;
    }

    @action.bound
    setResult(result) {
        this.result = result;
    }
}

export default ReportsStore;
