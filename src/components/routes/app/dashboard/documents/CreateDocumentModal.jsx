import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';
import Select from 'react-select';

@inject('createDocument')
@observer
class CreateDocumentModal extends Component {

    constructor() {

        super();
        this.state = {
            fileInputKey: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSpeakerChange = this.handleSpeakerChange.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.props.createDocument.setFormData(name, value);
    }

    handleSpeakerChange(value) {

        this.props.createDocument.setFormData('speaker', value);
    }

    handleFileInputChange(event) {

        const { value, files } = event.target;

        if (value === '' || files.length === 0) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            this.props.createDocument.setFormData('textContent', text);
            //TODO: this isn't working
            this.setState({
                fileInputKey: this.state.fileInputKey++
            });
        };
        reader.readAsText(files[0]);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.createDocument.submit();
    }

    render() {

        const { isVisible, isLoading, formData, formErrors, speakerOptions, isSubmitting, hide } = this.props.createDocument;

        formData.title;
        formData.speaker;
        formData.date;
        formData.textContent;//TODO: these are needed to trigger re-render
        formErrors.title;
        formErrors.speaker;
        formErrors.date;
        formErrors.textContent;

        const renderContent = () => (
            <form id="form-create-document" className="form" onSubmit={this.handleSubmit}>
                <label className="form__label">
                    <span>Title</span>
                    {formErrors.title ? (
                        <span className="form__error">{formErrors.title}</span>
                    ) : null}
                    <input className="form__text-input" type="text" name="title" value={formData.title} onChange={this.handleChange} />
                </label>
                <label className="form__label">
                    <span>Speaker</span>
                    {formErrors.speaker ? (
                        <span className="form__error">{formErrors.speaker}</span>
                    ) : null}
                    <Select name="speaker" placeholder="" value={formData.speaker} options={speakerOptions.peek()} onChange={this.handleSpeakerChange} />
                </label>
                <label className="form__label">
                    <span>Date</span>
                    {formErrors.date ? (
                        <span className="form__error">{formErrors.date}</span>
                    ) : null}
                    <input className="form__text-input" type="text" name="date" placeholder="YYYY-MM-DD" value={formData.date} onChange={this.handleChange} />
                </label>
                <label className="form__label">
                    <span>Text Content</span>
                    {formErrors.textContent ? (
                        <span className="form__error">{formErrors.textContent}</span>
                    ) : null}
                    <textarea className="form__textarea-input" name="textContent" rows="10" value={formData.textContent} onChange={this.handleChange} />
                </label>
                <label className="form__label form__label--small">
                    Import from File
                    <input key={this.state.fileInputKey} className="form__file-select" type="file" accept="text/plain" onChange={this.handleFileInputChange} />
                </label>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--primary" form="form-create-document">Save</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                title="Create Document"
                renderContent={renderContent}
                renderFooter={renderFooter}
                isLoading={isLoading || isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default CreateDocumentModal;
