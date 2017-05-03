import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import SpeakersFilters from './SpeakersFilters';
import SpeakersTableControls from './SpeakersTableControls';
import SpeakersTable from './SpeakersTable';

@inject('app')
@inject('speakers')
@inject('createSpeaker')
@inject('manageSpeakerLabels')
@observer
class Speakers extends Component {

    constructor() {
        super();
        this.toggleFilters = this.toggleFilters.bind(this);
        this.state = {
            filtersAreVisible: false
        };
    }

    componentWillMount() {

        this.props.speakers.initializeState();
    }

    toggleFilters() {
        this.setState({
            filtersAreVisible: !this.state.filtersAreVisible
        });
    }

    render() {

        const { app, createSpeaker, manageSpeakerLabels } = this.props;
        const { filtersAreVisible } = this.state;

        return (
            <div className="section data">
                <div className="section__header">
                    <div className="container">
                        <h1 className="section__heading">Speakers</h1>
                        {app.currentUser !== null ? (
                            <div className="section__header-buttons">
                                <button className="button" onClick={manageSpeakerLabels.show}>
                                    <i className="button__icon fa fa-tags" />
                                    <span>Manage Speaker Labels</span>
                                </button>
                                <button className="button" onClick={createSpeaker.show}>
                                    <i className="button__icon fa fa-plus" />
                                    <span>Create Speaker</span>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
                {filtersAreVisible ? (
                    <div className="section__filter-header">
                        <SpeakersFilters />
                    </div>
                ) : null}
                <div className="section__navigation-header">
                    <div className="container">
                        <SpeakersTableControls toggleFilters={this.toggleFilters} filtersAreVisible={filtersAreVisible} />
                    </div>
                </div>
                <div className="section__body">
                    <div className="container">
                        <SpeakersTable />
                    </div>
                </div>
                <div className="section__navigation-header">
                    <div className="container">
                        <SpeakersTableControls />
                    </div>
                </div>
            </div>
        );
    }
}

export default Speakers;
