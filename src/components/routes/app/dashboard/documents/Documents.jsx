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
                <div className="section__navigation-header">
                    <div className="section__results-per-page-holder">
                        <select name="resultsPerPage">
                            <option value="10">Show 10</option>
                            <option value="20">Show 20</option>
                            <option value="30">Show 30</option>
                            <option value="40">Show 40</option>
                            <option value="50">Show 50</option>
                        </select>
                    </div>
                    <div className="section__pagination-holder">
                        <nav className="pagination">
                            <button className="pagination__button pagination__button--active">1</button>
                            <button className="pagination__button">2</button>
                            <button className="pagination__button">3</button>
                            <button className="pagination__button">4</button>
                            <button className="pagination__button">5</button>
                            <button className="pagination__button">6</button>
                            <button className="pagination__button">7</button>
                            <button className="pagination__button">8</button>
                            <button className="pagination__button pagination__button--placeholder">...</button>
                            <button className="pagination__button">93</button>
                        </nav>
                    </div>
                </div>
                <div className="section__body">
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
        );
    }
}

export default Documents;
