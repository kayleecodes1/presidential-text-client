import { observable, action } from 'mobx';
import { createReport } from '../../services/api/reports';
import { getSpeakers } from '../../services/api/speakers';

class CreateReportStore {

    notificationsStore;
    reportsStore;

    @observable isVisible = false;
    @observable formData = {
        analytic: ''
    };
    @observable formErrors = {
        analytic: ''
    };
    @observable isSubmitting = false;
    cancelSubmitting = null;

    constructor(notificationsStore, reportsStore) {
        this.notificationsStore = notificationsStore;
        this.reportsStore = reportsStore;
    }

    @action.bound
    show() {

        this.isVisible = true;

        this.formData = {
            analytic: ''
        };
        this.formErrors = {
            analytic: ''
        };
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

        const { analytic } = this.formData;

        let hasErrors = false;
        if (analytic === '') {
            hasErrors = true;
            this.formErrors.analytic = 'Report type is required.';
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
            analytic,
            collections: {
                'First Collection': {
                    documents: [1, 2, 3, 4, 5]
                },
                'Second Collection': {
                    documents: [6, 7, 8, 9, 10]
                }
            }
        };

        this.isSubmitting = true;
        createReport(data)
            .then((result) => {
                if (isCancelled) {
                    return;
                }
                this.reportsStore.setResult(result);
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
