import React, { Component, PropTypes } from 'react';
import props from 'deep-property';

const stats = [
    { key: 'num_sent_total', label: 'Total Sentences' },
    { key: 'num_sent_avg', label: 'Average Sentences' },
    { key: 'num_word_total', label: 'Total Words' },
    { key: 'num_word_avg', label: 'Average Words' },
    { key: 'cardinality', label: 'Cardinality' },
    { key: 'sentiment', label: 'Sentiment' },
    { key: 'noun', label: 'Total Nouns' },
    { key: 'adj', label: 'Total Adjectives' },
    { key: 'verb', label: 'Total Verbs' },
    { key: 'adv', label: 'Total Adverbs' }
];

function formatInteger(number) {
    return parseInt(number, 10).toLocaleString();
}

function formatFloat(number) {
    return (parseInt(number * Math.pow(10, 3), 10) / Math.pow(10, 3)).toLocaleString();
}

class Scorecard extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    render() {

        const collections = Object.keys(this.props.data.collections).map((name) => {
            const { num_sent_total, num_sent_avg, num_word_total, num_word_avg, cardinality, sentiment, pos } = this.props.data.collections[name].result;
            return {
                name,
                result: {
                    num_sent_total: formatInteger(num_sent_total),
                    num_sent_avg: formatInteger(num_sent_avg),
                    num_word_total: formatInteger(num_word_total),
                    num_word_avg: formatInteger(num_word_avg),
                    cardinality: formatInteger(cardinality),
                    sentiment: formatFloat(sentiment),
                    noun: formatInteger(pos.noun),
                    adj: formatInteger(pos.adj),
                    verb: formatInteger(pos.verb),
                    adv: formatInteger(pos.adv)
                }
            };
        });

        //const collectionNames = Object.keys(collections);

        return (
            <div className="scorecard">
                <table className="table">
                    <thead className="table__head">
                        <tr className="table__row">
                            <td className="table__head-cell table__head-cell--small" />
                            {collections.map((collection) => (
                                <th key={collection.name} className="table__head-cell">{collection.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table__body">
                        {stats.map((s) => (
                            <tr key={s.key} className="table__row">
                                <th className="table__head-cell table__head-cell--body table__head-cell--right">{s.label}</th>
                                {collections.map((collection) => (
                                    <td key={collection.name} className="table__cell">{props.get(collection.result, s.key)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Scorecard;
