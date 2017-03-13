import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.css';
import './styles/index.scss';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { browserHistory, Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './components/routes/app/App';
import Login from './components/routes/app/login/Login';
import Dashboard from './components/routes/app/dashboard/Dashboard';
import Documents from './components/routes/app/dashboard/documents/Documents';
import Speakers from './components/routes/app/dashboard/speakers/Speakers';
import Reports from './components/routes/app/dashboard/reports/Reports';
import AppStore from './stores/AppStore';
import DocumentsStore from './stores/DocumentsStore';

const appStore = new AppStore();
const routingStore = new RouterStore();
const documentsStore = new DocumentsStore();

const stores = {
    routing: routingStore,
    app: appStore,
    documents: documentsStore
};

const history = syncHistoryWithStore(browserHistory, routingStore);

render(
    <AppContainer>
        <Provider {...stores}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRedirect to="/documents" />
                    <Route component={Dashboard}>
                        <Route path="documents" component={Documents} />
                        <Route path="speakers" component={Speakers} />
                        <Route path="reports" component={Reports} />
                    </Route>
                    <Route path="login" component={Login} />
                </Route>
            </Router>
        </Provider>
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./components/routes/app/App', () => {
        const NextApp = require('./components/routes/app/App').default;
        const NextLogin = require('./components/routes/app/login/Login').default;
        const NextDashboard = require('./components/routes/app/dashboard/Dashboard').default;
        const NextDocuments = require('./components/routes/app/dashboard/documents/Documents').default;
        const NextSpeakers = require('./components/routes/app/dashboard/speakers/Speakers').default;
        const NextReports = require('./components/routes/app/dashboard/reports/Reports').default;
        render(
            <AppContainer>
                <Provider {...stores}>
                    <Router history={history}>
                        <Route path="/" component={NextApp}>
                            <Route path="login" component={NextLogin} />
                            <IndexRoute component={NextDashboard}>
                                <IndexRedirect to="/data" />
                                <Route path="data" component={NextDocuments} />
                                <Route path="speakers" component={NextSpeakers} />
                                <Route path="reports" component={NextReports} />
                            </IndexRoute>
                        </Route>
                    </Router>
                </Provider>
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
