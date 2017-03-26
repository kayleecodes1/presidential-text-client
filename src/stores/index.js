import { RouterStore } from 'mobx-react-router';
import AppStore from './AppStore';
import NotificationsStore from './NotificationsStore';
import DocumentsStore from './documents/DocumentsStore';
import CreateDocumentStore from './documents/CreateDocumentStore';
import EditDocumentStore from './documents/EditDocumentStore';
import DeleteDocumentStore from './documents/DeleteDocumentStore';
import SpeakersStore from './speakers/SpeakersStore';
import CreateSpeakerStore from './speakers/CreateSpeakerStore';
import EditSpeakerStore from './speakers/EditSpeakerStore';
import DeleteSpeakerStore from './speakers/DeleteSpeakerStore';

const routing = new RouterStore();

const app = new AppStore();

const notifications = new NotificationsStore();

const documents = new DocumentsStore(notifications);
const createDocument = new CreateDocumentStore(notifications, documents);
const editDocument = new EditDocumentStore(notifications, documents);
const deleteDocument = new DeleteDocumentStore(notifications, documents);

const speakers = new SpeakersStore(notifications);
const createSpeaker = new CreateSpeakerStore(notifications, speakers);
const editSpeaker = new EditSpeakerStore(notifications, speakers);
const deleteSpeaker = new DeleteSpeakerStore(notifications, speakers);

const stores = {
    routing,
    app,
    notifications,
    documents,
    createDocument,
    editDocument,
    deleteDocument,
    speakers,
    createSpeaker,
    editSpeaker,
    deleteSpeaker
};

export default stores;
