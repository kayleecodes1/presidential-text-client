import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

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

function formatStat() {
    
}

class Scorecard extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderScorecard(svg, scores){
        if (svg === null) {
            return;
        }

        const margin = {top: 50, right: 10, bottom: 10, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        let x = d3.scalePoint().range([0, width], 1),
            y = {},
            dragging = {};

        const line = d3.line(),
            axis = d3.axisLeft(y);

        svg = d3.select('svg')/*.append('svg')*/
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let vals = '';
        vals += 'Name' + ',';
        vals += 'Total Sent' + ','  ;
        vals += 'Average Sent' + ','  ;
        vals += 'Total Words' + ','  ;
        vals += 'Average Words' + ','  ;
        vals += 'Cardinality' + ','  ;
        vals += 'Sentiment' + ','  ;
        vals += 'Total Nouns' + ','  ;
        vals += 'Total Adjectives' + ','  ;
        vals += 'Total Verbs' + ','  ;
        vals += 'Total Adverbs' + ',' ;



        for(let lst in scores) {
            vals += '\n';
            vals += lst + ',';
            vals += scores[lst].result.num_sent_total + ',';
            vals += scores[lst].result.num_sent_avg + ',';
            vals += scores[lst].result.num_word_total + ',';
            vals += scores[lst].result.num_word_avg + ',';
            vals += scores[lst].result.cardinality + ',';
            vals += scores[lst].result.sentiment + ',';
            vals += scores[lst].result.pos.noun + ',';
            vals += scores[lst].result.pos.adj + ',';
            vals += scores[lst].result.pos.verb + ',';
            vals += scores[lst].result.pos.adv + ',';
        }

        let data = d3.csvParse(vals);

            // Extract the list of dimensions and create a scale for each.
            let dimensions = [];
            x.domain(dimensions = d3.keys(data[0]).filter(
                function(d) {
                    let xxx = y[d];
                    return d !== 'Name' && d !== '' && (y[d] = d3.scaleLinear()
                        .domain(d3.extent(data, function(p) {
                            let ppp = p;
                            return +p[d];
                        }))
                        .range([height, 0]));
            }));

            // Add grey background lines for context.
            const background = svg.append('g')
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);

            // Add blue foreground lines for focus.
            const foreground = svg.append('g')
                .attr('class', 'foreground')
                .selectAll('path')
                .data(data)
                .enter().append('path')
                .attr('d', path);

            // Add a group element for each dimension.
            const g = svg.selectAll('.dimension')
                .data(dimensions)
                .enter().append('g')
                .attr('class', 'dimension')
                .attr('transform', function(d) {
                    let xd = x(d);
                    return 'translate(' + x(d) + ')';
                });
                /*.call(d3.drag()
                    .subject(function(d) { return {x: x(d)}; })
                    .on('start', function(d) {
                        dragging[d] = x(d);
                        background.attr('visibility', 'hidden');
                    })
                    .on('drag', function(d) {
                        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                        foreground.attr('d', path);
                        dimensions.sort(function(a, b) { return position(a) - position(b); });
                        x.domain(dimensions);
                        g.attr('transform', function(d) { return 'translate(' + position(d) + ')'; })
                    })
                    .on('end', function(d) {
                        delete dragging[d];
                        transition(d3.select(this)).attr('transform', 'translate(' + x(d) + ')');
                        transition(foreground).attr('d', path);
                        background
                            .attr('d', path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr('visibility', null);
                    }));*/

            // Add an axis and title.
            g.append('g')
                .attr('class', 'axis')
                .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
                .append('text')
                .style('text-anchor', 'middle')
                .attr('y', -9)
                .text(function(d) { return d; });

            // Add and store a brush for each axis.
            /*
            g.append('g')
                .attr('class', 'brush')
                .each(function(d) {
                    d3.select(this).call(d3.brushY()
                        .extent([0,0],[width,height])
                        .on("brush", brush));
                })
                .selectAll('rect')
                .attr('x', -8)
                .attr('width', 16);
            */
/*
        function position(d) {
            let v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }
*/
        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }
/*
        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }
*/
        // Handles a brush event, toggling the display of foreground lines.

        function brush() {
            let actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
                extents = actives.map(function(p) { return y[p].brush.extent(); });
            foreground.style("display", function(d) {
                return actives.every(function(p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });
        }

        function brushended() {
            if (!d3.event.sourceEvent) {return;} // Only transition after input.
            if (!d3.event.selection) {return;} // Ignore empty selections.
            var d0 = d3.event.selection.map(x.invert),
                d1 = d0.map(d3.timeDay.round);

            // If empty when rounded, use floor & ceil instead.
            if (d1[0] >= d1[1]) {
                d1[0] = d3.timeDay.floor(d0[0]);
                d1[1] = d3.timeDay.offset(d1[0]);
            }

            d3.select(this).transition().call(d3.event.target.move, d1.map(x));
        }

    }
    render() {

        const { collections } = this.props.data;

        const collectionName = 'Scorecard';
        return (

            <div className="scorecard">

                    <div key={collectionName} className="scorecard__item">
                        <h2 className="word-cloud__label">{collectionName}</h2>
                        <svg ref={(svg) => { Scorecard.renderScorecard(svg, collections); }} />
                    </div>

            </div>
        );
    }
}

export default Scorecard;
