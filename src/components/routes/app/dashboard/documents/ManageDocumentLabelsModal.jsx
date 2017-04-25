import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('documents')
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

        const { currentDocumentLabels } = this.props.documents;
        const { isVisible, isEditing, formData, formErrors, addOrEditLabel, cancelAddOrEditLabel, isSubmitting, hide } = this.props.manageDocumentLabels;

        formData._labelId;
        formData.key;
        formData.value;//TODO: these are needed to trigger re-render
        formErrors.key;
        formErrors.value;

        const renderContent = () => (
            <div>
                {currentDocumentLabels.length > 0 ? (
                    <ul className="labels-list">
                        {currentDocumentLabels.map((label) => (
                            <li key={label.id} className="labels-list__item">
                                {isEditing && formData._labelId === label.id ? (
                                    <form id="form-edit-document-label" className="form" onSubmit={this.handleSubmit}>
                                        <div className="labels-list__inputs-holder">
                                            <div className="labels-list__key">
                                                <label className="form__label">
                                                    <span>Key</span>
                                                    <input className="form__text-input" type="text" name="key" value={formData.key} autoFocus onChange={this.handleChange} />
                                                    {formErrors.key ? (
                                                        <span className="form__error">{formErrors.key}</span>
                                                    ) : null}
                                                </label>
                                            </div>
                                            <div className="labels-list__value">
                                                <label className="form__label">
                                                    <span>Value</span>
                                                    <input className="form__text-input" type="text" name="value" value={formData.value} onChange={this.handleChange} />
                                                    {formErrors.value ? (
                                                        <span className="form__error">{formErrors.value}</span>
                                                    ) : null}
                                                </label>
                                            </div>
                                        </div>
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
                                    <div className="labels-list__inputs-holder">
                                        <div className="labels-list__key">
                                            <label className="form__label">
                                                <span>Key</span>
                                                <input className="form__text-input" type="text" readOnly value={label.key} onFocus={() => addOrEditLabel(label.id)} />
                                            </label>
                                        </div>
                                        <div className="labels-list__value">
                                            <label className="form__label">
                                                <span>Value</span>
                                                <input className="form__text-input" type="text" readOnly value={label.value} onFocus={() => addOrEditLabel(label.id)} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="form__empty-message">No document labels to display.</div>
                )}
                {isEditing && formData._labelId === null ? (
                    <form id="form-add-document-label" className="form" onSubmit={this.handleSubmit}>
                        <div className="labels-list__inputs-holder">
                            <div className="labels-list__key">
                                <label className="form__label">
                                    <span>Key</span>
                                    <input className="form__text-input" type="text" name="key" value={formData.key} autoFocus onChange={this.handleChange} />
                                    {formErrors.key ? (
                                        <span className="form__error">{formErrors.key}</span>
                                    ) : null}
                                </label>
                            </div>
                            <div className="labels-list__value">
                                <label className="form__label">
                                    <span>Value</span>
                                    <input className="form__text-input" type="text" name="value" value={formData.value} onChange={this.handleChange} />
                                    {formErrors.value ? (
                                        <span className="form__error">{formErrors.value}</span>
                                    ) : null}
                                </label>
                            </div>
                        </div>
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
                isLoading={isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default ManageDocumentLabelsModal;
