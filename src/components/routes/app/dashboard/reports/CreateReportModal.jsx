import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';
import Select from 'react-select';

@inject('filterSets')
@inject('createReport')
@observer
class CreateReportModal extends Component {

    constructor() {

        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFilterSetsChange = this.handleFilterSetsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.props.createReport.setFormData(name, value);
    }

    handleFilterSetsChange(value) {

        this.props.createReport.setFormData('filterSets', value);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.createReport.submit();
    }

    render() {

        const { filterSets } = this.props;
        const { isVisible, formData, formErrors, isSubmitting, hide } = this.props.createReport;

        formData.analytic;
        formData.clusterOption;
        formData.classifyOption;
        formData.filterSets//TODO: required for update
        formErrors.analytic;
        formErrors.classifyOption;
        formErrors.filterSets;

        const options = filterSets.currentFilterSets.map((filterSet) => ({ value: filterSet.name, label: filterSet.name }));

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
                        <option value="sentimentyear">Sentiment by Year</option>
                        <option value="cluster">Cluster</option>
                        <option value="classify">Classify</option>
                    </select>
                </label>
                {formData.analytic === 'cluster' ? (
                    <label className="form__label">
                        <span>Cluster Method</span>
                        <select className="form__select" name="clusterOption" value={formData.clusterOption} onChange={this.handleChange}>
                            <option value="single">Single</option>
                            <option value="complete">Complete</option>
                            <option value="average">Average</option>
                            <option value="weighted">Weighted</option>
                            <option value="centroid">Centroid</option>
                            <option value="median">Median</option>
                            <option value="ward">Ward</option>
                        </select>
                        <div className="form__input-link">
                            <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.cluster.hierarchy.linkage.html" target="_blank">Click here to learn about each cluster method.</a>
                        </div>
                    </label>
                ) : null}
                {formData.analytic === 'classify' ? (
                    <label className="form__label">
                        <span>Classify K-folds</span>
                        {formErrors.classifyOption ? (
                            <span className="form__error">{formErrors.classifyOption}</span>
                        ) : null}
                        <input type="text" className="form__text-input" name="classifyOption" value={formData.classifyOption} onChange={this.handleChange} />
                    </label>
                ) : null}
                <label className="form__label" style={{ height: '150px' }}>
                    <span>Filter Sets</span>
                    {formErrors.filterSets ? (
                        <span className="form__error">{formErrors.filterSets}</span>
                    ) : null}
                    {options.length ? (
                        <Select name="filterSets" placeholder="" multi={true} options={options} value={formData.filterSets.peek()} onChange={this.handleFilterSetsChange} />
                    ) : (
                        <span className="form__empty-message">No filter sets.</span>
                    )}
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
