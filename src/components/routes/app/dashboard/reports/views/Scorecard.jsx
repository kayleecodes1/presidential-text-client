import React, { Component, PropTypes } from 'react';
import props from 'deep-property';

const stats = [
    { key: 'num_sent_total', label: 'Total Sent' },
    { key: 'num_sent_avg', label: 'Average Sent' },
    { key: 'num_word_total', label: 'Total Words' },
    { key: 'num_word_avg', label: 'Average Words' },
    { key: 'cardinality', label: 'Cardinality' },
    { key: 'sentiment', label: 'Sentiment' },
    { key: 'pos.noun', label: 'Total Nouns' },
    { key: 'pos.pronoun', label: 'Total Pronouns' },
    { key: 'pos.adj', label: 'Total Adjectives' },
    { key: 'pos.verb', label: 'Total Verbs' },
    { key: 'pos.adv', label: 'Total Adverbs' },
    { key: 'pos.determiner', label: 'Total Determiners' }
];

class Scorecard extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    render() {

        const { collections } = this.props.data;

        const collectionNames = Object.keys(collections);

        return (
            <div className="scorecard">
                <table className="table">
                    <thead className="table__head">
                        <tr className="table__row">
                            <td className="table__head-cell table__head-cell--small" />
                            {collectionNames.map((collectionName) => (
                                <th key={collectionName} className="table__head-cell">{collectionName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table__body">
                        {stats.map((s) => (
                            <tr key={s} className="table__row">
                                <th className="table__head-cell table__head-cell--body table__head-cell--right">{s.label}</th>
                                {collectionNames.map((collectionName) => (
                                    <td key={collectionName} className="table__cell">{props.get(collections[collectionName].result, s.key)}</td>
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
