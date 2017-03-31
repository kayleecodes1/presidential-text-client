import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('speakers')
@inject('createSpeaker')
@inject('editSpeaker')
@inject('deleteSpeaker')
@observer
class Speakers extends Component {

    componentWillMount() {

        this.props.speakers.getSpeakers();
    }

    renderSpeakerRows() {

        const { editSpeaker, deleteSpeaker } = this.props;
        const { resultsPerPage, isLoadingSpeakers, currentPageSpeakers } = this.props.speakers;

        if (isLoadingSpeakers) {
            const placeholderRows = [];
            for (let i = 0; i < resultsPerPage; i++) {
                placeholderRows.push(
                    <tr key={`placeholder_${i}`} className="table__row">
                        <td colSpan="2" className="table__cell">
                            <div className="loading-placeholder table__content-placeholder"></div>
                        </td>
                    </tr>
                );
            }
            return placeholderRows;
        }

        let rows = currentPageSpeakers.map((speaker, index) => (
            <tr key={speaker.id} className="table__row">
                <td className="table__cell">{speaker.name}</td>
                <td className="table__cell">
                    <ul className="button-list">
                        <li className="button-list__item button-list__item--tiny-spacing">
                            <button className="button button--tiny" onClick={() => editSpeaker.show(speaker.id)}>
                                <i className="button__icon button__icon--tiny fa fa-pencil" />
                                <span>Edit</span>
                            </button>
                        </li>
                        <li className="button-list__item button-list__item--tiny-spacing">
                            <button className="button button--tiny" onClick={() => deleteSpeaker.show(speaker.id)}>
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
                    <td colSpan="2" className="table__cell table__cell--centered">No speakers to display.</td>
                </tr>
            );
        }

        return rows;
    }

    render() {

        const { createSpeaker } = this.props;
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
        } = this.props.speakers;

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Speakers</h1>
                        <div className="section__header-buttons">
                            <button className="button" onClick={createSpeaker.show}>
                                <i className="button__icon fa fa-plus" />
                                <span>Create Speaker</span>
                            </button>
                        </div>
                    </div>
                </div>
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
                                    <th  className={classNames('table__head-cell', 'table__head-cell--sortable', { [`table__head-cell--sort-${sortOrder === 1 ? 'ascend' : 'descend'}`]: sortAttribute === 'name' })} onClick={() => setSortAttribute('name')}>
                                        Name
                                    </th>
                                    <th className="table__head-cell table__head-cell--centered">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table__body">
                                {this.renderSpeakerRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Speakers;
