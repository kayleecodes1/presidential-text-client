import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';
import classNames from 'classnames';
import CreateDocumentModal from './documents/CreateDocumentModal';
import EditDocumentModal from './documents/EditDocumentModal';
import DeleteDocumentModal from './documents/DeleteDocumentModal';
import CreateSpeakerModal from './speakers/CreateSpeakerModal';
import EditSpeakerModal from './speakers/EditSpeakerModal';
import DeleteSpeakerModal from './speakers/DeleteSpeakerModal';

@inject('routing')
@inject('app')
@observer
class Dashboard extends Component {

    componentWillMount() {
        this.redirectIfNotLoggedIn();
    }

    componentWillUpdate() {
        this.redirectIfNotLoggedIn();
    }

    redirectIfNotLoggedIn() {
        if (this.props.app.currentUser === null) {
            this.props.routing.push('/login');
        }
    }

    render() {

        const { routing, app } = this.props;

        const location = routing.location.pathname;
        const isDocuments = (location === '/documents');
        const isSpeakers = (location === '/speakers');
        const isReports = (location === '/reports');

        if (app.currentUser === null) {
            return null;
        }

        return (
            <div className="dashboard">
                <header className="dashboard__header">
                    <div className="container">
                        <div className="dashboard__brand">Presidential Text</div>
                        <nav className="dashboard__nav">
                            <ul className="dashboard__nav-list">
                                <li className="dashboard__nav-item">
                                    <Link className={classNames('dashboard__nav-link', { 'dashboard__nav-link--active': isDocuments })} to="/documents">
                                        <i className={classNames('dashboard__nav-icon', 'fa', 'fa-file-text', { 'dashboard__nav-icon--active': isDocuments })} />
                                        <span>Documents</span>
                                    </Link>
                                </li>
                                <li className="dashboard__nav-item">
                                    <Link className={classNames('dashboard__nav-link', { 'dashboard__nav-link--active': isSpeakers })} to="/speakers">
                                        <i className={classNames('dashboard__nav-icon', 'fa', 'fa-user', { 'dashboard__nav-icon--active': isSpeakers })} />
                                        <span>Speakers</span>
                                    </Link>
                                </li>
                                <li className="dashboard__nav-item">
                                    <Link className={classNames('dashboard__nav-link', { 'dashboard__nav-link--active': isReports })} to="/reports">
                                        <i className={classNames('dashboard__nav-icon', 'fa', 'fa-bar-chart', { 'dashboard__nav-icon--active': isReports })} />
                                        <span>Reports</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="dashboard__user">
                            <div className="dashboard__user-name">{app.currentUser.name}</div>
                            <button className="dashboard__logout-button" onClick={app.logout}>Logout</button>
                        </div>
                    </div>
                </header>
                <div className="dashboard__content">
                    {this.props.children}
                </div>
                <CreateDocumentModal />
                <EditDocumentModal />
                <DeleteDocumentModal />
                <CreateSpeakerModal />
                <EditSpeakerModal />
                <DeleteSpeakerModal />
            </div>
        );
    }
}

export default Dashboard;
