import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import * as d3 from 'd3';
import tip from 'd3-tip';
d3.tip = tip;
import * as d3Scale from 'd3-scale-chromatic';

import {brush, brushSelection}  from 'd3-brush';

import event from 'd3-selection';
d3.event = event;

import {zoom}  from 'd3-zoom';




const WIDTH = 960;
const HEIGHT = 400;

@inject('reports')
@observer
class SentimentYear extends Component {

    renderSentimentYear(svg, vals, colorScale) {

        if (svg === null) {
            return;
        }

        let strData = 'date,sentiment,docId,list\n';
        for (let lst in vals) {
            let docYear = vals[lst].result.documentyear;
            let docSent = vals[lst].result.documentsentiment;
            for (let k in docYear) {

                strData += docYear[k] + ',' + docSent[k] + ',' + k + ',' + lst + '\n';
            }
        }

        const parseTime = d3.timeParse('%Y-%m-%d');
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
        const margin = {top: 20, right: 20, bottom: 20, left: 40},
            width = WIDTH - margin.left - margin.right,
            height = HEIGHT - margin.top - margin.bottom;

        let idleTimeout, idleDelay = 350;

        /*
         Set x & y scales and create axes
         */
        const x = d3.scaleTime()
            .range([0, width]);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const xAxis = d3.axisBottom(x);

        const yAxis = d3.axisLeft(y);

        /*
         Set functions
         */


        const tip = d3.tip()
            .attr('class', 'sentiment-year__tooltip')
            .direction('n')
            .offset([-10, 0])
            .html((d) => {
                const title = this.props.reports.getDocumentTitle(d.docId);
                const sentiment = d.sentiment.toFixed(4);
                return `<span class='sentiment-year__tooltip-title'>${title}</span>` +
                    `<span class='sentiment-year__tooltip-sentiment'>${sentiment}</span>`;
            });

        var brush = d3.brush().on('end', brushended);

        /*
         Build chart
         */
        svg = d3.select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
            .call(tip)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

        //svg.call(tip);

        // Add Detail Chart


        /*  =======================
         Top Chart
         ======================= */
        // Set domains
        x.domain(d3.extent(data, function (d) {
            return d.date;
        })).nice();

        y.domain([-1, 1]).nice();



        // Add x Axis
        const gX = svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + (height ) + ')')
            .call(xAxis);

        // Add y Axis
        const gY = svg.append('g')
            .attr('class', 'axis axis--y')
            //.attr('transform', 'translate(' + margin.left + ',0)')
            .call(yAxis);

        svg.append('g')
            .attr('class', 'brush')
            //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            //.attr('width', (width - margin.left - margin.right))
            .call(brush)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.append('defs').append('clipPath')
            .attr('id', 'clip').append('rect')
            .attr('width', width)
            .attr('height', height);

        // Add points to top chart
        /*const view = svg.append('rect')
            .classed('view', true)
            .attr('width', width)
            .attr('height', height)
            .attr('transform', 'translate(' + margin.left + ',' + margin.bottom + ')');*/

        var objects = svg.append('g')
            .classed('objects', true)
            .attr('width', width)
            .attr('height', height)
            .attr('clip-path', 'url(#clip)');


        objects.selectAll('.point')
            .data(data)
            .enter()
            .append('path')
            .attr('class', function (d) {
                return 'point ' + d.listName.replace(/\s/g, '');
            })
            .style('fill', function (d) {
                return colorScale(d.listName);
            })
            .style('opacity', .75)
            .attr('d', d3.symbol().type(function (d) {
                if (d.sentiment < 0) {
                    return d3.symbolWye;
                } else {
                    return d3.symbolCircle;
                }
            }))
            .attr('transform', transform)
            .style('stroke', function (d) {
                if (d.sentiment < 0) {
                    return '#585F61';
                } else {
                    return '#C1C7C9';
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

        function zoomed() {
            const xz = d3.event.transform.rescaleX(x);
            gX.call(xAxis.scale(xz));

            svg.selectAll('.point')
                .attr('transform', transform)
            ;
        }

        function brushended() {
            var s = d3.event.selection;
            if (!s) {
                if (!idleTimeout) {

                return idleTimeout = setTimeout(idled, idleDelay)
            }
                const xDom =d3.extent(data, function (d) {
                    return d.date;
                });
                x.domain(xDom).nice();
                y.domain([-1,1]).nice();
            } else {
                x.domain([s[0][0], s[1][0]].map(x.invert, x));
                y.domain([s[1][1], s[0][1]].map(y.invert, y));
                svg.select('.brush').call(brush.move, null);
            }
            zoom();
        }
        function idled() {
            idleTimeout = null;
        }
        function zoom() {
            var t = svg.transition().duration(750);
            svg.select('.axis--x').transition(t).call(xAxis);
            svg.select('.axis--y').transition(t).call(yAxis);
            svg.selectAll('.point').transition(t)
                .attr('transform', transform)
        }

        function resetted() {
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        }

        function transform(d) {
            return 'translate(' + x(d.date) + ',' + y(d.sentiment) + ')';
        }

    }

    render() {

        const {collections} = this.props.data;

        const colorScale = d3.scaleOrdinal(d3Scale.schemeSet1)
            .domain(Object.keys(collections));

        return (
            <div className='sentiment-year'>
                <ul className='view-report__legend'>
                    {Object.keys(collections).map((collectionName) => (
                        <li key={collectionName} className='view-report__legend-item'>
                            <div className='view-report__legend-shape'
                                 style={{background: colorScale(collectionName)}}></div>
                            <span>{collectionName}</span>
                        </li>
                    ))}
                </ul>
                <svg className='sentiment-year__chart'
                     ref={(svg) => this.renderSentimentYear(svg, collections, colorScale)}/>
            </div>
        );
    }
}

export default SentimentYear;