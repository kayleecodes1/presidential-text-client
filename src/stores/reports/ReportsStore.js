import { observable, action } from 'mobx';
import { createReport } from '../../services/api/reports';

class ReportsStore {

    notificationsStore;

    @observable isLoading = false;
    @observable result = null;

    constructor(notificationsStore) {
        this.notificationsStore = notificationsStore;
    }

    @action.bound
    setResult(result) {
        this.result = result;
    }
}

export default ReportsStore;
