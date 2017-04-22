import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('manageDocumentLabels')
@observer
class ManageDocumentLabelsModal extends Component {

    constructor() {

        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.props.manageDocumentLabels.setFormData(name, value);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.manageDocumentLabels.submit();
    }

    render() {

        const { isVisible, isLoading, currentLabels, isEditing, formData, formErrors, addOrEditLabel, cancelAddOrEditLabel, isSubmitting, hide } = this.props.manageDocumentLabels;

        formData._labelId;
        formData.title;//TODO: these are needed to trigger re-render
        formErrors.title;

        const renderContent = () => (
            <div>
                {currentLabels.length > 0 ? (
                    <ul className="labels-list">
                        {currentLabels.map((label) => (
                            <li className="labels-list__item">
                                {isEditing && formData._labelId === label.id ? (
                                    <form id="form-edit-document-label" className="form" onSubmit={this.handleSubmit}>
                                        {formErrors.title ? (
                                            <span className="form__error">{formErrors.title}</span>
                                        ) : null}
                                        <input className="form__text-input" type="text" name="title" value={formData.title} autoFocus onChange={this.handleChange} />
                                        <div className="button-list button-list--left" style={{ height: '18px', marginTop: '6px' }}>
                                            <div className="button-list__item">
                                                <button className="button button--tiny" type="button" onClick={cancelAddOrEditLabel}>Cancel</button>
                                            </div>
                                            <div className="button-list__item">
                                                <button className="button button--primary button--tiny" form="form-edit-document-label">Save</button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <input type="text" value={label.title} onFocus={() => addOrEditLabel(label.id)} />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="form__empty-message">No document labels to display.</div>
                )}
                {isEditing && formData._labelId === null ? (
                    <form id="form-add-document-label" className="form" onSubmit={this.handleSubmit}>
                        {formErrors.title ? (
                            <span className="form__error">{formErrors.title}</span>
                        ) : null}
                        <input className="form__text-input" type="text" name="title" value={formData.title} autoFocus onChange={this.handleChange} />
                        <div className="button-list button-list--left" style={{ height: '18px', marginTop: '6px' }}>
                            <div className="button-list__item">
                                <button className="button button--tiny" type="button" onClick={cancelAddOrEditLabel}>Cancel</button>
                            </div>
                            <div className="button-list__item">
                                <button className="button button--primary button--tiny" form="form-add-document-label">Save</button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <button className="button" onClick={() => addOrEditLabel(null)}>
                        <i className="button__icon fa fa-plus" />
                        <span>Add New Document Label</span>
                    </button>
                )}
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                title="Manage Document Labels"
                renderContent={renderContent}
                isLoading={isLoading || isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default ManageDocumentLabelsModal;
