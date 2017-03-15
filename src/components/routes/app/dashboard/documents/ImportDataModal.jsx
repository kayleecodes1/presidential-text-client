import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('documents')
@observer
class ImportDataModal extends Component {

    constructor() {

        super();
        this.state = {
            title: '',
            speaker: '',
            date: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {

        event.preventDefault();

        console.log('submitted');//TODO
    }

    render() {

        const { importDataModalIsVisible, hideImportDataModal, isProcessingImportData } = this.props.documents;
        const { title, speaker, date } = this.state;

        const contentElement = (
            <form id="form-import-data" className="form" onSubmit={this.handleSubmit}>
                <label className="form__label">
                    <span>Title</span>
                    <input className="form__text-input" type="text" name="title" value={title} onChange={this.handleChange} />
                </label>
                <label className="form__label">
                    <span>Speaker</span>
                    <input className="form__text-input" type="text" name="speaker" value={speaker} onChange={this.handleChange} />
                </label>
                <label className="form__label">
                    <span>Date</span>
                    <input className="form__text-input" type="text" name="date" value={date} onChange={this.handleChange} />
                </label>
            </form>
        );

        const footerElement = (
            <div className="modal__button-row">
                <button className="button button" onClick={hideImportDataModal}>Cancel</button>
                <button className="button button--primary" form="form-import-data">Import</button>
            </div>
        );

        return (
            <Modal
                isVisible={importDataModalIsVisible}
                title="Import Data"
                content={contentElement}
                footer={footerElement}
                isLoading={isProcessingImportData}
                closeFunction={hideImportDataModal} />
        );
    }
}

export default ImportDataModal;
