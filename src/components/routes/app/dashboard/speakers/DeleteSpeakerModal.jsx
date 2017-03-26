import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('deleteSpeaker')
@observer
class DeleteSpeakerModal extends Component {

    constructor() {

        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.deleteSpeaker.submit();
    }

    render() {

        const { isVisible, isSubmitting, hide } = this.props.deleteSpeaker;

        const renderContent = () => (
            <form id="form-delete-speaker" className="form" onSubmit={this.handleSubmit}>
                <p className="form__paragraph">Are you sure you want to delete this speaker?</p>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--danger" form="form-delete-speaker">Delete</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                windowSize="small"
                title="Delete Speaker"
                renderContent={renderContent}
                renderFooter={renderFooter}
                isLoading={isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default DeleteSpeakerModal;
