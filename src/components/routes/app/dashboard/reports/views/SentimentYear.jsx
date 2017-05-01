import React, {Component, PropTypes} from 'react';
import { inject, observer } from 'mobx-react';
import * as d3 from 'd3';
import tip from 'd3-tip';
d3.tip = tip;
import * as d3Scale from 'd3-scale-chromatic';
import * as d3Trans from 'd3-transition';

const WIDTH = 960;
const HEIGHT = 400;

@inject('reports')
@observer
class SentimentYear extends Component {

    renderSentimentYear(svg, vals, colorScale) {

        let strData = 'date,sentiment,docId,list\n';
        for (let lst in vals) {
            let docYear = vals[lst].result.documentyear;
            let docSent = vals[lst].result.documentsentiment;
            for (let k in docYear) {

                strData += '01-' + '01-' + docYear[k] + ',' + docSent[k] + ',' + k + ',' + lst + '\n';
            }
        }

        const parseTime = d3.timeParse('%m-%d-%Y');
        let data = d3.csvParse(strData, function (d) {
            return {
                date: parseTime(d.date),
                sentiment: +d.sentiment,
                docId: d.docId,
                listName: d.list
            }
        });

        /*
         Set sizing
         */
        const margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = WIDTH - margin.left - margin.right,
            height = HEIGHT - margin.top - margin.bottom;

        /*
         Set x & y scales and create axes
         */
        const x = d3.scaleTime()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const xAxis = d3.axisBottom(x);

        const yAxis = d3.axisLeft(y);

        const transition = d3Trans;
        /*
         Build chart
         */
        svg = d3.select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

        const tip = d3.tip()
            .attr('class', 'sentiment-year__tooltip')
            .direction('n')
            .offset([-10, 0])
            .html((d) => {
                const title = this.props.reports.getDocumentTitle(d.docId);
                const sentiment = d.sentiment.toFixed(4);
                return `<span class="sentiment-year__tooltip-title">${title}</span>` +
                    `<span class="sentiment-year__tooltip-sentiment">${sentiment}</span>`;
            });
        svg.call(tip);

        svg = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x.domain(d3.extent(data, function (d) {
            return d.date;
        })).nice();
        y.domain([-1, 1]).nice();

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('class', 'label')
            .attr('x', width)
            .attr('y', -6)
            .style('text-anchor', 'end')
            .text('Year');

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Sentiment')

        svg.selectAll('.point')
            .data(data)
            .enter().append('path')
            .attr('class', function (d) {
                return 'point ' + d.listName.replace(/\s/g, '');
            })
            .style('fill', function (d) {
                return colorScale(d.listName);
            })
            .attr('d', d3.symbol().type(function (d) {
                if (d.sentiment < 0) {
                    return d3.symbolWye;
                } else {
                    return d3.symbolCircle;
                }
            }))
            .attr('transform', function (d) {
                return 'translate(' + x(d.date) + ',' + y(d.sentiment) + ')';
            })
            .style('stroke', function (d) {
                if (d.sentiment < 0) {
                    return '#585F61';
                } else {
                    return '#C1C7C9';//color(d.listName);
                }
            })
            .style('stroke-width', function (d) {
                if (d.sentiment < 0) {
                    return 1;
                } else {
                    return 1;
                }
            })
            .style('z-index', function (d) {
                return Math.abs(d.sentiment);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        // Highlights the list
        function cellover(d) {
            d3.selectAll('.' + d.replace(/\s/g, ''))
                .style('stroke-width', 2)
                .size(128);
        }

        // Sets width back to regular
        function cellout(d) {
            d3.selectAll('.' + d.replace(/\s/g, ''))
                .style('stroke-width', 1);
        }

    }

    render() {

        const { collections } = this.props.data;

        const colorScale = d3.scaleOrdinal(d3Scale.schemeSet1)
            .domain(Object.keys(collections));

        return (
            <div className="sentiment-year">
                <ul className="view-report__legend">
                    {Object.keys(collections).map((collectionName) => (
                        <li key={collectionName} className="view-report__legend-item">
                            <div className="view-report__legend-shape" style={{ background: colorScale(collectionName) }}></div>
                            <span>{collectionName}</span>
                        </li>
                    ))}
                </ul>
                <svg className="sentiment-year__chart" ref={(svg) => this.renderSentimentYear(svg, collections, colorScale)} />
            </div>
        );
    }
}

export default SentimentYear;