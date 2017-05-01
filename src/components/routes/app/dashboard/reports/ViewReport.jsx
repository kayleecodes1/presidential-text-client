import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Scorecard from './views/Scorecard';
import WordCloud from './views/WordCloud';
import Sentiment from './views/Sentiment';
import SentimentYear from './views/SentimentYear';
import TopTen from './views/TopTen';
import PartOfSpeech from './views/PartOfSpeech';
import Cluster from './views/Cluster';
import Classify from './views/Classify';

@inject('reports')
@observer
class ViewReport extends Component {

    renderMeta() {

        const { result } = this.props.reports;

        if (!result) {
            return null;
        }

        const TITLE = {
            scorecard: 'Scorecard',
            wordcloud: 'Word Cloud',
            sentiment: 'Sentiment',
            sentimentyear: 'Sentiment by Year',
            top: 'Top 10 Words',
            pos: 'Part of Speech',
            cluster: 'Cluster',
            classify: 'Classify'
        };

        return (
            <div className="view-report__meta">
                <div className="view-report__title">{TITLE[result.analytic]}</div>
                <div className="view-report__time">Processed in {result.time}.</div>
            </div>
        );
    }

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
                return <Sentiment data={result}/>;
            case 'sentimentyear':
                return <SentimentYear data={result}/>;
            case 'top':
                return <TopTen data={result}/>;
            case 'pos':
                return <PartOfSpeech data={result}/>;
            case 'cluster':
                return <Cluster data={result} />;
            case 'classify':
                return <Classify data={result} />;
            default:
                return JSON.stringify(result);
        }
    }

    render() {

        return (
            <div className="view-report">
                {this.renderMeta()}
                {this.renderResult()}
            </div>
        );
    }
}

export default ViewReport;
