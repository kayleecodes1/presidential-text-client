import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('createReport')
@observer
class CreateReportModal extends Component {

    constructor() {

        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.props.createReport.setFormData(name, value);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.createReport.submit();
    }

    render() {

        const { isVisible, formData, formErrors, isSubmitting, hide } = this.props.createReport;

        formData.analytic;//TODO: required for update
        formErrors.analytic;

        const renderContent = () => (
            <form id="form-create-report" className="form" onSubmit={this.handleSubmit}>
                <label className="form__label">
                    <span>Report Type</span>
                    {formErrors.analytic ? (
                        <span className="form__error">{formErrors.analytic}</span>
                    ) : null}
                    <select className="form__select" name="analytic" value={formData.analytic} onChange={this.handleChange}>
                        <option value="" />
                        <option value="scorecard">Scorecard</option>
                        <option value="wordcloud">Word Cloud</option>
                        <option value="distinct">Distinct Words</option>
                        <option value="unique">Unique Words</option>
                        <option value="top">Top 10 Words</option>
                        <option value="pos">Part of Speech</option>
                        <option value="sentiment">Sentiment</option>
                    </select>
                </label>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--primary" form="form-create-report">Create</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                title="Create Report"
                renderContent={renderContent}
                renderFooter={renderFooter}
                isLoading={isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default CreateReportModal;
