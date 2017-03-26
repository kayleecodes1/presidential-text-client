import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('deleteDocument')
@observer
class DeleteDocumentModal extends Component {

    constructor() {

        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.deleteDocument.submit();
    }

    render() {

        const { isVisible, isSubmitting, hide } = this.props.deleteDocument;

        const renderContent = () => (
            <form id="form-delete-document" className="form" onSubmit={this.handleSubmit}>
                <p className="form__paragraph">Are you sure you want to delete this document?</p>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--danger" form="form-delete-document">Delete</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                windowSize="small"
                title="Delete Document"
                renderContent={renderContent}
                renderFooter={renderFooter}
                isLoading={isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default DeleteDocumentModal;
