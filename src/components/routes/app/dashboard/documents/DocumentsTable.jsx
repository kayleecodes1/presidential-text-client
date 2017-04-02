import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('documents')
@inject('editDocument')
@inject('deleteDocument')
@observer
class DocumentsTable extends Component {

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

        const { sortAttribute, sortOrder, setSortAttribute } = this.props.documents;

        return (
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
        );
    }
}

export default DocumentsTable;
