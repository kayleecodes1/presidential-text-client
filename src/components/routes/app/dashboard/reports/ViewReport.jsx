import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Scorecard from './views/Scorecard';
import WordCloud from './views/WordCloud';
import Sentiment from './views/Sentiment';
import SentimentYear from "./views/SentimentYear";
import TopTen from "./views/TopTen";

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
            case 'sentiment':
                return <Sentiment data={result}/>
            case 'sentimentyear':
                return <SentimentYear data={result}/>
            case 'top':
                return <TopTen data={result}/>
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
