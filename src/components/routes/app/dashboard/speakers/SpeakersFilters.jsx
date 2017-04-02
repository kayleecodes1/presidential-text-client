import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('speakers')
@observer
class SpeakersFilters extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.props.speakers.setFilterData(name, value);
    }

    render() {

        const { filters } = this.props.speakers;

        return (
            <form className="filter-controls">
                <div className="filter-controls__item">
                    <label htmlFor="title" className="filter-controls__label">Name</label>
                    <div className="filter-controls__input-holder">
                        <input className="form__text-input" type="text" name="name" value={filters.name} onChange={this.handleChange} />
                    </div>
                </div>
            </form>
        );
    }
}

export default SpeakersFilters;
