import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ViewReport from './ViewReport';

@inject('reports')
@inject('createReport')
@observer
class Reports extends Component {

    componentWillMount() {

        this.props.reports.initializeState();
    }

    render() {

        const { createReport } = this.props;

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Reports</h1>
                        <div className="section__header-buttons">
                            <button className="button" onClick={createReport.show}>
                                <i className="button__icon fa fa-plus" />
                                <span>Create Report</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="section__body section__body--clear-bottom">
                    <div className="container">
                        <ViewReport />
                    </div>
                </div>
            </div>
        );
    }
}

export default Reports;
