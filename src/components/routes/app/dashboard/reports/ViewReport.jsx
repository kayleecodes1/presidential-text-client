import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Scorecard from './views/Scorecard';
import WordCloud from './views/WordCloud';

@inject('reports')
@observer
class ViewReport extends Component {

    renderResult() {

        const { result } = this.props.reports;

        if (!result) {
            return (
                <div className="empty-message">No report to display.</div>
            );
        }

        switch (result.analytic) {
            case 'scorecard':
                return <Scorecard data={result} />;
            case 'wordcloud':
                return <WordCloud data={result} />;
            //TODO: other report types
            default:
                return JSON.stringify(result);
        }
    }

    render() {

        return (
            <div className="view-report">
                {this.renderResult()}
            </div>
        );
    }
}

export default ViewReport;
