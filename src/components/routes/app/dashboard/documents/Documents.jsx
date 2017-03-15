import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('documents')
@observer
class Documents extends Component {

    render() {

        //const { location, push, goBack } = this.props.routing;
        const { showImportDataModal } = this.props.documents;

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Documents</h1>
                        <div className="section__header-buttons">
                            <button className="button" onClick={showImportDataModal}>
                                <i className="button__icon fa fa-cloud-upload" />
                                <span>Import Data</span>
                            </button>
                            <button className="button">
                                <i className="button__icon fa fa-cloud-download" />
                                <span>Export Data</span>
                            </button>
                            <button className="button">
                                <i className="button__icon fa fa-tags" />
                                <span>Configure Labels</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="section__navigation-header">
                    <div className="container">
                        <div className="table-controls">
                            <div className="table-controls__results-control">
                                <span>Rows per page:</span>
                                <select className="table-controls__results-select">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="table-controls__results-count">1-10 of 100</div>
                            <div className="table-controls__pages-control">
                                <button className="table-controls__page-button">
                                    <i className="fa fa-chevron-left" />
                                </button>
                                <button className="table-controls__page-button">
                                    <i className="fa fa-chevron-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section__body">
                    <div className="container">
                        <div className="table">
                            <div className="table__head">
                                <div className="table__row">
                                    <div className="table__head-cell">
                                        Title
                                    </div>
                                    <div className="table__head-cell">
                                        Date
                                    </div>
                                    <div className="table__head-cell">
                                        Speaker
                                    </div>
                                    <div className="table__head-cell table__head-cell--centered">
                                        Actions
                                    </div>
                                </div>
                            </div>
                            <div className="table__body">
                                {[...Array(20)].map((e, index) => (
                                    <div key={index} className="table__row">
                                        <div className="table__cell">
                                            First Inaugural Address
                                        </div>
                                        <div className="table__cell">
                                            Apr 30, 1789
                                        </div>
                                        <div className="table__cell">
                                            George Washington
                                        </div>
                                        <div className="table__cell table__cell--centered">
                                            <i className="fa fa-pencil" />
                                            <i className="fa fa-trash" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Documents;
