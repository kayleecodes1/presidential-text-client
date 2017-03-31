import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('documents')
@inject('createDocument')
@inject('editDocument')
@inject('deleteDocument')
@observer
class Documents extends Component {

    componentWillMount() {

        this.props.documents.getDocuments();
    }

    renderDocumentRows() {

        const { editDocument, deleteDocument } = this.props;
        const { resultsPerPage, isLoadingDocuments, currentPageDocuments } = this.props.documents;

        if (isLoadingDocuments) {
            const placeholderRows = [];
            for (let i = 0; i < resultsPerPage; i++) {
                placeholderRows.push(
                    <tr key={`placeholder_${i}`} className="table__row">
                        <td colSpan="4" className="table__cell">
                            <div className="loading-placeholder table__content-placeholder"></div>
                        </td>
                    </tr>
                );
            }
            return placeholderRows;
        }

        let rows = currentPageDocuments.map((document, index) => (
            <tr key={document.id} className="table__row">
                <td className="table__cell">{document.title}</td>
                <td className="table__cell">{document.date}</td>
                <td className="table__cell">{document.speakerName}</td>
                <td className="table__cell">
                    <ul className="button-list">
                        <li className="button-list__item button-list__item--tiny-spacing">
                            <button className="button button--tiny" onClick={() => editDocument.show(document.id)}>
                                <i className="button__icon button__icon--tiny fa fa-pencil" />
                                <span>Edit</span>
                            </button>
                        </li>
                        <li className="button-list__item button-list__item--tiny-spacing">
                            <button className="button button--tiny" onClick={() => deleteDocument.show(document.id)}>
                                <i className="button__icon button__icon--tiny fa fa-trash" />
                                <span>Delete</span>
                            </button>
                        </li>
                    </ul>
                </td>
            </tr>
        ));

        if (rows.length === 0) {
            rows = (
                <tr className="table__row">
                    <td colSpan="4" className="table__cell table__cell--centered">No documents to display.</td>
                </tr>
            );
        }

        return rows;
    }

    render() {

        const { createDocument } = this.props;
        const {
            resultsPerPage,
            sortAttribute,
            sortOrder,
            totalPages,
            totalResults,
            firstResultNumber,
            lastResultNumber,
            setResultsPerPage,
            goToPage,
            goToPreviousPage,
            goToNextPage,
            setSortAttribute
        } = this.props.documents;

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Documents</h1>
                        <div className="section__header-buttons">
                            <button className="button" onClick={createDocument.show}>
                                <i className="button__icon fa fa-plus" />
                                <span>Create Document</span>
                            </button>
                        </div>
                    </div>
                </div>
                {true ? null : <div className="section__filter-header">
                    <div className="container">
                        <form>
                            <div className="section__filter-holder section__filter-holder--1-4">
                                <label htmlFor="title" className="section__filter-label">Title</label>
                                <div className="section__filter-input-holder">
                                    <input className="form__text-input" type="text" name="title" />
                                </div>
                            </div>
                            <div className="section__filter-holder section__filter-holder--1-4">
                                <label htmlFor="startDate" className="section__filter-label">Start Date</label>
                                <div className="section__filter-input-holder">
                                    <input className="form__text-input" type="text" name="startDate" />
                                </div>
                            </div>
                            <div className="section__filter-holder section__filter-holder--1-4">
                                <label htmlFor="endDate" className="section__filter-label">End Date</label>
                                <div className="section__filter-input-holder">
                                    <input className="form__text-input" type="text" name="endDate" />
                                </div>
                            </div>
                            <div className="section__filter-holder section__filter-holder--1-4">
                                <label htmlFor="speakers" className="section__filter-label">Speaker(s)</label>
                                <div className="section__filter-input-holder">
                                    <input className="form__text-input" type="text" name="speakers" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
                <div className="section__navigation-header">
                    <div className="container">
                        <div className="table-controls">
                            <div className="table-controls__results-control">
                                <span>Rows per page:</span>
                                <select className="table-controls__results-select" value={resultsPerPage} onChange={(event) => setResultsPerPage(event.target.value)}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="table-controls__results-count">{firstResultNumber}-{lastResultNumber} of {totalResults}</div>
                            <div className="table-controls__pages-control">
                                <button className="table-controls__page-button" onClick={() => goToPage(1)}>
                                    <i className="fa fa-chevron-left" style={{ marginRight: '-3px' }} />
                                    <i className="fa fa-chevron-left" />
                                </button>
                                <button className="table-controls__page-button" onClick={goToPreviousPage}>
                                    <i className="fa fa-chevron-left" />
                                </button>
                                <button className="table-controls__page-button" onClick={goToNextPage}>
                                    <i className="fa fa-chevron-right" />
                                </button>
                                <button className="table-controls__page-button" onClick={() => goToPage(totalPages)}>
                                    <i className="fa fa-chevron-right" style={{ marginRight: '-3px' }} />
                                    <i className="fa fa-chevron-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section__body">
                    <div className="container">
                        <table className="table">
                            <thead className="table__head">
                                <tr className="table__row">
                                    <th className={classNames('table__head-cell', 'table__head-cell--sortable', { [`table__head-cell--sort-${sortOrder === 1 ? 'ascend' : 'descend'}`]: sortAttribute === 'title' })} onClick={() => setSortAttribute('title')}>
                                        <span>Title</span>
                                    </th>
                                    <th className={classNames('table__head-cell', 'table__head-cell--sortable', { [`table__head-cell--sort-${sortOrder === 1 ? 'ascend' : 'descend'}`]: sortAttribute === 'date' })} onClick={() => setSortAttribute('date')}>
                                        <span>Date</span>
                                    </th>
                                    <th className={classNames('table__head-cell', 'table__head-cell--sortable', { [`table__head-cell--sort-${sortOrder === 1 ? 'ascend' : 'descend'}`]: sortAttribute === 'speakerName' })} onClick={() => setSortAttribute('speakerName')}>
                                        <span>Speaker</span>
                                    </th>
                                    <th className="table__head-cell table__head-cell--centered">
                                        <span>Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table__body">
                                {this.renderDocumentRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Documents;
