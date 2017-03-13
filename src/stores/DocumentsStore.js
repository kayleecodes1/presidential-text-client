import { observable } from 'mobx';

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
}

export default DocumentsStore;
