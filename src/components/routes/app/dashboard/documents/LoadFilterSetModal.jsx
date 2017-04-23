import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';
import Select from 'react-select';

@inject('filterSets')
@inject('loadFilterSet')
@observer
class LoadFilterSetModal extends Component {

    constructor() {

        super();
        this.handleFilterSetChange = this.handleFilterSetChange.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFilterSetChange(value) {

        this.props.loadFilterSet.setFormData('filterSet', value);
    }

    handleFileInputChange(event) {
        const { value, files } = event.target;
        if (value === '' || files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            this.props.loadFilterSet.submitImport(text);
        };
        reader.readAsText(files[0]);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.loadFilterSet.submit();
    }

    render() {

        const { currentFilterSets } = this.props.filterSets;
        const { isVisible, formData, formErrors, hide } = this.props.loadFilterSet;

        formData.filterSet;//TODO: these are needed to trigger re-render
        formErrors.filterSet;

        const options = currentFilterSets.map((filterSet) => ({ key: filterSet.name, label: filterSet.name }));

        const renderContent = () => (
            <form id="form-create-document" className="form" onSubmit={this.handleSubmit} style={{ minHeight: '250px' }}>
                <label className="form__label">
                    <span>Filter Set</span>
                    {formErrors.filterSet ? (
                        <span className="form__error">{formErrors.filterSet}</span>
                    ) : null}
                    <Select name="filterSet" placeholder="" value={formData.filterSet} options={options} onChange={this.handleFilterSetChange} />
                </label>
                <label className="form__label">
                    <span>Import from File</span>
                    <input className="form__file-select" type="file" accept="application/json" onChange={this.handleFileInputChange} />
                </label>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--primary" form="form-create-document">Load</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                title="Load Filter Set"
                renderContent={renderContent}
                renderFooter={renderFooter}
                closeFunction={hide} />
        );
    }
}

export default LoadFilterSetModal;
