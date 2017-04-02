import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

@inject('documents')
@observer
class DocumentsFilters extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSpeakerChange = this.handleSpeakerChange.bind(this);
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

    handleSpeakerChange(value) {
        this.props.documents.setFilterData('speakers', value);
    }

    render() {

        const { filters, speakerOptions } = this.props.documents;

        return (
            <form className="filter-controls">
                <div className="filter-controls__item filter-controls__item--4-12">
                    <label htmlFor="title" className="filter-controls__label">Title</label>
                    <div className="filter-controls__input-holder">
                        <input className="form__text-input" type="text" name="title" value={filters.title} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="filter-controls__item filter-controls__item--2-12">
                    <label htmlFor="startDate" className="filter-controls__label">Start Date</label>
                    <div className="filter-controls__input-holder">
                        <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.startDate} onChange={this.handleStartDateChange} />
                    </div>
                </div>
                <div className="filter-controls__item filter-controls__item--2-12">
                    <label htmlFor="endDate" className="filter-controls__label">End Date</label>
                    <div className="filter-controls__input-holder">
                        <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.endDate} onChange={this.handleEndDateChange} />
                    </div>
                </div>
                <div className="filter-controls__item filter-controls__item--4-12">
                    <label htmlFor="speakers" className="filter-controls__label">Speaker(s)</label>
                    <div className="filter-controls__input-holder">
                        <Select name="speaker" placeholder="" multi={true} options={speakerOptions.peek()} value={filters.speakers.peek()} onChange={this.handleSpeakerChange} />
                    </div>
                </div>
            </form>
        );
    }
}

export default DocumentsFilters;
