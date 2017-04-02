import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { inject, observer } from 'mobx-react';
import * as d3 from 'd3';

const RESIZE_TIMEOUT = 50;
const HEIGHT = 400;

const reportData = {
    "analytic": "scorecard",
    "collections": {
        "collection1": {
            "result": {
                "sentiment": "-91.4",
                "num_word_avg": "83.6",
                "num_sent_total": "164",
                "cardinality": "23",
                "num_word_total": "418",
                "num_sent_avg": "32.8",
                "pos": {
                    "verb": "5",
                    "determiner": "0",
                    "pronoun": "14",
                    "noun": "23",
                    "adj": "32",
                    "adv": "26"
                }
            }
        },
        "collection2": {
            "result": {
                "sentiment": "75.6",
                "num_word_avg": "91.4",
                "num_sent_total": "86",
                "cardinality": "5",
                "num_word_total": "457",
                "num_sent_avg": "17.2",
                "pos": {
                    "verb": "13",
                    "determiner": "11",
                    "pronoun": "1",
                    "noun": "26",
                    "adj": "11",
                    "adv": "38"
                }
            }
        }
    }
};

const keys = ['verb', 'determiner', 'pronoun', 'noun', 'adj', 'adv'];

@inject('reports')
@observer
class ScorecardReport extends Component {

    constructor() {
        super();
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            width: 0
        };
        this._debounceTimeoutId = null;
    }

    handleResize() {
        const element = findDOMNode(this);
        const width = element.offsetWidth;
        if (this._debounceTimeoutId) {
            clearTimeout(this._debounceTimeoutId);
        }
        this._debounceTimeoutId = setTimeout(() => {
            this.setState({
                width
            });
            this._debounceTimeoutId = null;
        }, RESIZE_TIMEOUT);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {

        const data = Object.keys(reportData.collections).map((name) => ({
            name,
            result: keys.reduce((obj, k) => {
                obj[k] = parseFloat(reportData.collections[name].result.pos[k]);
                return obj;
            }, {})
        }));

        const scorecardAttribute = 'sentiment';

        const x0 = d3.scaleBand()
            .range([0, this.state.width])
            .domain(data.map((d) => d.name))
            .padding(0.1);
        const x1 = d3.scaleBand()
            .rangeRound([0, x0.bandwidth()])
            .domain(keys)
            .padding(0.05);
        const y = d3.scaleLinear()
            .rangeRound([HEIGHT, 0])
            .domain([0, d3.max(data, (d) => d3.max(keys, (k) => d.result[k]))]);
        const z = d3.scaleOrdinal()
            .range(['#CCC', '#BBB', '#AAA', '#999', '#888', '#777']);

        const barsGroups = data.map((d) => (
            <g key={d.name} transform={`translate(${x0(d.name)},0)`}>
                {keys.map((k) => (
                    <rect key={k} className="chart__bar"
                          x={x1(k)}
                          y={y(d.result[k])}
                          width={x1.bandwidth()}
                          height={HEIGHT - y(d.result[k])}
                          fill={z(d.result[k])} />
                ))}
            </g>
        ));

        const xAxis = (
            <g transform={`translate(0,${HEIGHT})`}>

            </g>
        );
        const yAxis = (
            <g></g>
        );

        /*const rect = data.map((d, i) => {
            const yValue = d.result.sentiment;
            return (
                <rect key={i} className="chart__bar"
                    data-value={yValue}
                    x={x(d.name)}
                    y={yValue > 0 ? y(yValue) : HEIGHT / 2}
                    width={x.bandwidth()}
                    height={yValue > 0 ? (HEIGHT / 2) - y(yValue) : y(yValue) - (HEIGHT / 2)} />
            );
        });

        const xAxis = (
            <g></g>
        );

        const yAxis = (
            <g></g>
        );*/

        return (
            <div>
                <svg className="chart" width={this.state.width} height={HEIGHT}>
                    {barsGroups}
                </svg>
            </div>
        );
    }
}

export default ScorecardReport;
