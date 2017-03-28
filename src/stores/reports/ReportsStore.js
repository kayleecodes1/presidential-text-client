import { observable, action } from 'mobx';

class ReportsStore {

    notificationsStore;

    @observable isLoading = false;
    @observable currentReport = null;

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
    }

    //TODO
}

export default ReportsStore;
