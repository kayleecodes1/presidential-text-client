import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

//@inject('reports')
@observer
class Reports extends Component {

    render() {

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Reports</h1>
                        <div className="section__header-buttons">
                            <button className="button">
                                <i className="button__icon fa fa-plus" />
                                <span>Create Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Reports;
