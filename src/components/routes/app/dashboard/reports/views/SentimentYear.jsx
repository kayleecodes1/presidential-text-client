import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';

class SentimentYear extends Component {
    static renderSentimentYear(svg, vals) {
        alert('HI');
    }
    render() {

        const {collections} = this.props.data;

        const collectionName = 'SentimentYear';
        return (

            <div className="sentimentyear">

                <div key={collectionName} className="sentimentyear__item">
                    <h2 className="word-cloud__label">{collectionName}</h2>
                    <svg ref={(svg) => {
                        SentimentYear.renderSentimentYear(svg, collections);
                    }}/>
                </div>

            </div>
        );
    }
}

export default SentimentYear;