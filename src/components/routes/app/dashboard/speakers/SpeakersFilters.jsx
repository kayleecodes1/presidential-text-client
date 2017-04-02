import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';

@inject('speakers')
@observer
class SpeakersFilters extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.props.speakers.setFilterData(name, value);
    }

    handleStartDateChange(date) {
        this.props.speakers.setFilterData('startDate', date);
    }

    handleEndDateChange(date) {
        this.props.speakers.setFilterData('endDate', date);
    }

    render() {

        const { filters } = this.props.speakers;

        return (
            <form className="filter-controls">
                <div className="filter-controls__item filter-controls__item--6-12">
                    <label htmlFor="title" className="filter-controls__label">Name</label>
                    <div className="filter-controls__input-holder">
                        <input className="form__text-input" type="text" name="name" value={filters.name} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="filter-controls__item filter-controls__item--3-12">
                    <label htmlFor="startDate" className="filter-controls__label">Term Start Date</label>
                    <div className="filter-controls__input-holder">
                        <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.startDate} onChange={this.handleStartDateChange} />
                    </div>
                </div>
                <div className="filter-controls__item filter-controls__item--3-12">
                    <label htmlFor="endDate" className="filter-controls__label">Term End Date</label>
                    <div className="filter-controls__input-holder">
                        <DatePicker className="form__text-input" dateFormat="YYYY-MM-DD" selected={filters.endDate} onChange={this.handleEndDateChange} />
                    </div>
                </div>
            </form>
        );
    }
}

export default SpeakersFilters;
