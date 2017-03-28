import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../../../Modal.jsx';

@inject('createReport')
@observer
class CreateReportModal extends Component {

    constructor() {

        super();
        this.handleReportTypeChange = this.handleReportTypeChange.bind(this);
        this.handleDocumentListValueChange = this.handleDocumentListValueChange.bind(this);
        this.handleConditionValueChange = this.handleConditionValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleReportTypeChange(event) {

        this.props.createReport.setReportType(event.target.value);
    }

    handleDocumentListValueChange(event, index) {

        const { name, value } = event.target;
        this.props.createReport.setDocumentListValue(index, name, value);
    }

    handleConditionValueChange(event, documentListIndex, conditionIndex) {

        const { name, value } = event.target;
        this.props.createReport.setConditionValue(documentListIndex, conditionIndex, name, value);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.createDocument.submit();
    }

    render() {

        const { isVisible, isLoading, speakerOptions, reportType, documentLists,
            addDocumentList, removeDocumentList,
            addCondition, setConditionValue, removeCondition,
            isSubmitting, hide } = this.props.createReport;

        for (let i = 0; i < documentLists.length; i++) {
            documentLists[i].name;
            for (let j = 0; j < documentLists[i].conditions.length; j++) {
                documentLists[i].conditions[j].entityType;
                documentLists[i].conditions[j].labelName;
                documentLists[i].conditions[j].labelValue;
            }
        }//TODO: these are needed to trigger re-render

        const renderContent = () => (
            <form id="form-create-report" className="form" onSubmit={this.handleSubmit}>
                <label className="form__label">
                    <span>Report Type</span>
                    <select className="form__select" name="reportType" value={reportType} onChange={this.handleReportTypeChange}>
                        <option value=""></option>
                        <option value="scorecard">Score Card</option>
                    </select>
                </label>
                <label className="form__label">
                    <span>Document Lists</span>
                    <div className="repeater">
                        <ul className="repeater__list">
                            {documentLists.map((documentList, documentListIndex) => (
                                <li key={documentListIndex} className="repeater__item">
                                    <label className="form__label form__label--secondary">
                                        <span>List Name</span>
                                        <input type="text" name="name" value={documentList.name} onChange={(event) => this.handleDocumentListValueChange(event, documentListIndex)} />
                                    </label>
                                    <label className="form__label form__label--secondary">
                                        <span>Conditions</span>
                                        <div className="repeater">
                                            <ul className="repeater__list">
                                                {documentList.conditions.map((condition, conditionIndex) => (
                                                    <li key={conditionIndex} className="repeater__item">
                                                        <select name="entityType" value={condition.entityType} onChange={(event) => this.handleConditionValueChange(event, documentListIndex, conditionIndex)}>
                                                            <option value="document">Document</option>
                                                            <option value="speaker">Speaker</option>
                                                        </select>
                                                        {conditionIndex > 0 ? (
                                                            <button className="repeater__remove-button" type="button" onClick={(event) => { event.preventDefault(); removeCondition(documentListIndex, conditionIndex); }}>
                                                                <i className="fa fa-minus-circle" />
                                                            </button>
                                                        ) : null}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className="button button--tiny repeater__add-button" type="button" onClick={(event) => { event.preventDefault(); addCondition(documentListIndex); }}>
                                                <i className="button__icon fa fa-plus" />
                                                <span>Add Condition</span>
                                            </button>
                                        </div>
                                    </label>
                                    {documentListIndex > 0 ? (
                                        <button className="repeater__remove-button" type="button" onClick={(event) => { event.preventDefault(); removeDocumentList(documentListIndex); }}>
                                            <i className="fa fa-minus-circle" />
                                        </button>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                        <button className="button button--tiny repeater__add-button" type="button" onClick={addDocumentList}>
                            <i className="button__icon fa fa-plus" />
                            <span>Add Document List</span>
                        </button>
                    </div>
                </label>
            </form>
        );

        const renderFooter = () => (
            <div className="button-list button-list--right">
                <div className="button-list__item">
                    <button className="button button" onClick={hide}>Cancel</button>
                </div>
                <div className="button-list__item">
                    <button className="button button--primary" form="form-create-report">Generate</button>
                </div>
            </div>
        );

        return (
            <Modal
                isVisible={isVisible}
                title="Create Report"
                renderContent={renderContent}
                renderFooter={renderFooter}
                isLoading={isLoading || isSubmitting}
                closeFunction={hide} />
        );
    }
}

export default CreateReportModal;
