import React, { Component, PropTypes } from 'react';
import { Router, hashHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'mobx-react-router';

import stores from './stores';

let nextRouterId = 1;
const history = syncHistoryWithStore(hashHistory, stores.routing);

class Root extends Component {

    static propTypes = {
        routes: PropTypes.func.isRequired
    };

    render() {

        return (
            <Router key={nextRouterId++} history={history}>
                {this.props.routes()}
            </Router>
        );
    }
}

export default Root;
