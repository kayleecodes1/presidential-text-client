import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './components/routes/app/App';
import Login from './components/routes/app/login/Login';
import Dashboard from './components/routes/app/dashboard/Dashboard';
import Documents from './components/routes/app/dashboard/documents/Documents';
import Speakers from './components/routes/app/dashboard/speakers/Speakers';
import Reports from './components/routes/app/dashboard/reports/Reports';

const routes = () => {

    return (
        <Route path="/" component={App}>
            <IndexRedirect to="/documents" />
            <Route component={Dashboard}>
                <Route path="documents" component={Documents} />
                <Route path="speakers" component={Speakers} />
                <Route path="reports" component={Reports} />
            </Route>
            <Route path="login" component={Login} />
        </Route>
    );
};

export default routes;
