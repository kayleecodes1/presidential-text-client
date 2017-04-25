import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

@inject('documents')
@inject('filterSets')
@inject('loadFilterSet')
@observer
class DocumentsFilters extends Component {

    constructor() {
        super();
        this.handleFilterSetNameChange = this.handleFilterSetNameChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSpeakersChange = this.handleSpeakersChange.bind(this);
        this.handleDocumentLabelsChange = this.handleDocumentLabelsChange.bind(this);
        this.handleSpeakerLabelsChange = this.handleSpeakerLabelsChange.bind(this);
    }

    handleFilterSetNameChange(event) {
        this.props.documents.setFilterSetName(event.target.value);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.props.documents.setFilterData(name, value);
    }

    handleStartDateChange(date) {
        this.props.documents.setFilterData('startDate', date);
    }

    handleEndDateChange(date) {
        this.props.documents.setFilterData('endDate', date);
    }

    handleSpeakersChange(value) {
        this.props.documents.setFilterData('speakers', value);
    }

    handleDocumentLabelsChange(value) {
        this.props.documents.setFilterData('documentLabels', value);
    }

    handleSpeakerLabelsChange(value) {
        this.props.documents.setFilterData('speakerLabels', value);
    }

    render() {

        const { filterSets, loadFilterSet } = this.props;
        const { filterSetName, filters, currentFilterSetExists, filterSetIsDirty, saveFilterSet, deleteFilterSet, exportFilterSet, documentLabelOptions, speakerLabelOptions, speakerOptions } = this.props.documents;

        return (
            <form className="filter-controls">
                <div className="filter-controls__head">
                    <div className="container">
                        <div className="filter-controls__item filter-controls__item--4-12">
                            <input className="form__text-input" type="text" name="" placeholder="Untitled Filter Set" value={filterSetName} onChange={this.handleFilterSetNameChange} />
                        </div>
                        <div className="filter-controls__item filter-controls__item--2-12">
                            <button className="button button--full-width" type="button" disabled={!filterSetIsDirty} onClick={saveFilterSet}>
                                <i className="button__icon fa fa-save" />
                                <span>Save</span>
                            </button>
                        </div>
                        <div className="filter-controls__item filter-controls__item--2-12">
                            <button className="button button--full-width" type="button" disabled={filterSets.currentFilterSets.length === 0} onClick={loadFilterSet.show}>
                                <i className="button__icon fa fa-folder" />
                                <span>Load / Import</span>
                            </button>
                        </div>
                        <div className="filter-controls__item filter-controls__item--2-12">
                            <button className="button button--full-width" type="button" disabled={!currentFilterSetExists} onClick={deleteFilterSet}>
                                <i className="button__icon fa fa-trash" />
                                <span>Delete</span>
                            </button>
                        </div>
                        <div className="filter-controls__item filter-controls__item--2-12">
                            <button className="button button--full-width" type="button" disabled={!currentFilterSetExists} onClick={exportFilterSet}>
                                <i className="button__icon fa fa-download" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="filter-controls__listing">
                    <div className="container">
                        <div className="filter-controls__item filter-controls__item--6-12">
                            <label htmlFor="title" className="filter-controls__label">Title</label>
                            <div className="filter-controls__input-holder">
                                <input className="form__text-input" type="text" name="title" value={filters.title} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--3-12">
                            <label htmlFor="startDate" className="filter-controls__label">Start Date</label>
                            <div className="filter-controls__input-holder">
                                <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.startDate} onChange={this.handleStartDateChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--3-12">
                            <label htmlFor="endDate" className="filter-controls__label">End Date</label>
                            <div className="filter-controls__input-holder">
                                <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.endDate} onChange={this.handleEndDateChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--6-12">
                            <label htmlFor="speakers" className="filter-controls__label">Speaker(s)</label>
                            <div className="filter-controls__input-holder">
                                <Select name="speakers" placeholder="" multi={true} options={speakerOptions} value={filters.speakers.peek()} onChange={this.handleSpeakersChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--6-12">
                            <label htmlFor="title" className="filter-controls__label">Text Content</label>
                            <div className="filter-controls__input-holder">
                                <input className="form__text-input" type="text" name="textContent" value={filters.textContent} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--6-12">
                            <label htmlFor="title" className="filter-controls__label">Document Label(s)</label>
                            <div className="filter-controls__input-holder">
                                <Select name="documentLabels" placeholder="" multi={true} options={documentLabelOptions} value={filters.documentLabels.peek()} onChange={this.handleDocumentLabelsChange} />
                            </div>
                        </div>
                        <div className="filter-controls__item filter-controls__item--6-12">
                            <label htmlFor="title" className="filter-controls__label">Speaker Label(s)</label>
                            <div className="filter-controls__input-holder">
                                <Select name="speakerLabels" placeholder="" multi={true} options={speakerLabelOptions} value={filters.speakerLabels.peek()} onChange={this.handleSpeakerLabelsChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default DocumentsFilters;
