import { RouterStore } from 'mobx-react-router';
import AppStore from './AppStore';
import NotificationsStore from './NotificationsStore';
import FilterSetsStore from './documents/FilterSetsStore';
import DocumentsStore from './documents/DocumentsStore';
import LoadFilterSetStore from './documents/LoadFilterSetStore';
import CreateDocumentStore from './documents/CreateDocumentStore';
import EditDocumentStore from './documents/EditDocumentStore';
import DeleteDocumentStore from './documents/DeleteDocumentStore';
import SpeakersStore from './speakers/SpeakersStore';
import CreateSpeakerStore from './speakers/CreateSpeakerStore';
import EditSpeakerStore from './speakers/EditSpeakerStore';
import DeleteSpeakerStore from './speakers/DeleteSpeakerStore';
import ReportsStore from './reports/ReportsStore';
import CreateReportStore from './reports/CreateReportStore';

const routing = new RouterStore();
const app = new AppStore();
const notifications = new NotificationsStore();
const filterSets = new FilterSetsStore();
const documents = new DocumentsStore(notifications, filterSets);
const loadFilterSet = new LoadFilterSetStore(filterSets, documents);
const createDocument = new CreateDocumentStore(notifications, documents);
const editDocument = new EditDocumentStore(notifications, documents);
const deleteDocument = new DeleteDocumentStore(notifications, documents);
const speakers = new SpeakersStore(notifications);
const createSpeaker = new CreateSpeakerStore(notifications, speakers);
const editSpeaker = new EditSpeakerStore(notifications, speakers);
const deleteSpeaker = new DeleteSpeakerStore(notifications, speakers);
const reports = new ReportsStore(notifications);
const createReport = new CreateReportStore(notifications, filterSets, reports);

const stores = {
    routing,
    app,
    notifications,
    documents,
    loadFilterSet,
    createDocument,
    editDocument,
    deleteDocument,
    filterSets,
    speakers,
    createSpeaker,
    editSpeaker,
    deleteSpeaker,
    reports,
    createReport
};

export default stores;
