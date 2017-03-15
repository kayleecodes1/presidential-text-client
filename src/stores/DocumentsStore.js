import { observable } from 'mobx';
import { createDocument } from '../services/api/documents';

class DocumentsStore {

    @observable documents = [];
    @observable importDataModalIsVisible = false;
    @observable isProcessingImportData = false;

    constructor() {
        this.showImportDataModal = this.showImportDataModal.bind(this);
        this.hideImportDataModal = this.hideImportDataModal.bind(this);
    }

    showImportDataModal() {
        this.importDataModalIsVisible = true;
    }

    hideImportDataModal() {
        this.importDataModalIsVisible = false;
    }

    submitImportData(data) {
        this.isProcessingImportData = true;
        createDocument(data)
            .then(() => {
                //TODO
            })
            .catch((err) => {
                this.loginErrorText = err.message;
            })
            .then(() => {
                this.isProcessingImportData = false;
            });
    }
}

export default DocumentsStore;
