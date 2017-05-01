import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale-chromatic';
import * as d3Legend from 'd3-svg-legend';
import * as d3Trans from 'd3-transition';


class SentimentYear extends Component {
    static renderSentimentYear(svg, vals) {

        const d3Tip = require('d3-tip');

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
         Add tool tip
         */

        // Define the div for the tooltip
        let div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        /*
         Set sizing
         */
        const margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 625 - margin.top - margin.bottom;

        /*
         Set x & y scales and create axes
         */
        const x = d3.scaleTime()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const colorScheme = d3Scale.schemeSet1;

        let color = d3.scaleOrdinal(colorScheme);

        const xAxis = d3.axisBottom(x);

        const yAxis = d3.axisLeft(y);

        const transition = d3Trans;
        /*
         Build chart
         */
        svg = d3.select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
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
                return color(d.listName);
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
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        function mouseover(d){
            d3.select('.tooltip').transition()
                .duration(200)
                .style('opacity', .9);
            div.html('Doc Id: ' + d.docId + '<br/>Sentiment: '  + d.sentiment.toFixed(4))
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        }
        function mouseout(d){
            d3.select('.tooltip')
                .transition()
                .duration(500)
                .style("opacity", 0);	;
        }
        /*
         Add Legend
         */

        let ordDomain = [];
        for (var i in data) {
            ordDomain.push(data[i].listName);
        }

        let ordinal = d3.scaleOrdinal(colorScheme)
            .domain(ordDomain);

        let legendSVG = d3.select('.sentiment-year__item')
            .append('svg')
            .attr('class', 'svgLegend');

        legendSVG.append('g')
            .attr('class', 'legendOrdinal')
            .attr('transform', 'translate(20,20)');

        let legendOrdinal = d3Legend.legendColor()
            .shape('path', d3.symbol().type(d3.symbolSquare).size(height)())
            .shapePadding(10)
            .labelWrap(150)
            .cellFilter(function (d) {
                return d.label !== undefined
            })
            .on('cellover', cellover)
            .on('cellout', cellout)
            .scale(ordinal);

        legendSVG.select('.legendOrdinal')
            .call(legendOrdinal);

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

        const {collections} = this.props.data;

        const collectionName = 'Sentiment by Year';
        return (

            <div className='sentiment-year'>
                <div key={collectionName} className='sentiment-year__item'>
                    <h2 className='word-cloud__label'>{collectionName}</h2>
                    <svg ref={(svg) => {
                        SentimentYear.renderSentimentYear(svg, collections);
                    }}/>
                </div>
            </div>
        );
    }
}

export default SentimentYear;