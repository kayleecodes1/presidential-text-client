import { RouterStore } from 'mobx-react-router';
import AppStore from './AppStore';
import DocumentsStore from './DocumentsStore';

const routing = new RouterStore();
const app = new AppStore();
const documents = new DocumentsStore();

const stores = {
    routing,
    app,
    documents
};

export default stores;
