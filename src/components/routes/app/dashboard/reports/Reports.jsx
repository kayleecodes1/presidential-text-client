import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing')
@inject('app')
@observer
class Reports extends Component {

    render() {

        //const { location, push, goBack } = this.props.routing;

        return (
            <div className="reports">
                REPORTS
            </div>
        );
    }
}

export default Reports;
