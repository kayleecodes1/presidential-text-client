import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale-chromatic';
import * as d3Legend from 'd3-svg-legend';

const stats = [
    {key: 'num_sent_total', label: 'Total Sent'},
    {key: 'num_sent_avg', label: 'Average Sent'},
    {key: 'num_word_total', label: 'Total Words'},
    {key: 'num_word_avg', label: 'Average Words'},
    {key: 'cardinality', label: 'Cardinality'},
    {key: 'sentiment', label: 'Sentiment'},
    {key: 'pos.noun', label: 'Total Nouns'},
    {key: 'pos.pronoun', label: 'Total Pronouns'},
    {key: 'pos.adj', label: 'Total Adjectives'},
    {key: 'pos.verb', label: 'Total Verbs'},
    {key: 'pos.adv', label: 'Total Adverbs'},
    {key: 'pos.determiner', label: 'Total Determiners'}
];

class Scorecard extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderScorecard(svg, scores) {
        if (svg === null) {
            return;
        }

        /* ====================
            Set up the SVG area
           ==================== */
        const margin = {top: 30, right: 10, bottom: 10, left: 50},
            width = 960 - margin.left - margin.right,
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

        /*  =================================================
            Get the data.
            The data comes back in json format. The functions
            want it to be in csv.
            ================================================= */

        // Set the fields to pull in
        let vals = '';
        vals += 'Name' + ',';
        vals += 'Total Sent' + ',';
        vals += 'Avg Sent' + ',';
        vals += 'Total Words' + ',';
        vals += 'Avg Words' + ',';
        vals += 'Cardinality' + ',';
        vals += 'Sentiment' + ',';
        vals += 'Nouns' + ',';
        vals += 'Adjectives' + ',';
        vals += 'Verbs' + ',';
        vals += 'Adverbs' + ',';


        for (let lst in scores) {
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

        /*  ========================
            Start building the chart
            ======================== */
        const colorScheme = d3Scale.schemeSet1;

        let color = d3.scaleOrdinal(colorScheme);
        let data = d3.csvParse(vals);

        // Extract the list of dimensions and create a scale for each.
        let dimensions = [];
        x.domain(dimensions = d3.keys(data[0]).filter(
            function (d) {
                let xxx = y[d];
                return d !== 'Name' && d !== '' && (y[d] = d3.scaleLinear()
                        .domain(d3.extent(data, function (p) {
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
            .attr('d', path)
            .attr('stroke', function (d) {
                return color(d.Name);
            })
            .attr('data-legend', function (d) {
                return d.Name
            });

        // Add a group element for each dimension.
        const g = svg.selectAll('.dimension')
            .data(dimensions)
            .enter().append('g')
            .attr('class', 'dimension')
            .attr('transform', function (d) {
                let xd = x(d);
                return 'translate(' + x(d) + ')';
            });

        // Add an axis and title.
        g.append('g')
            .attr('class', 'axis')
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append('text')
            .style('text-anchor', 'left')
            .attr('y', -9)
            .text(function (d) {
                return d;
            });

        /*  ==========
            Add Legend
            ========== */

        let ordDomain = [];
        for (var i in data) {
            ordDomain.push(data[i].Name);
        }

        let ordinal = d3.scaleOrdinal(colorScheme)
            .domain(ordDomain);

        let legendSVG = d3.select('.scorecard__item')
            .append('svg')
            .attr('class', 'svgLegend');

        legendSVG.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(20,20)");

        let legendOrdinal = d3Legend.legendColor()
            .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
            //.title('Filter Sets')
            .shapePadding(10)
            .labelWrap(175)
            .cellFilter(function (d) {
                return d.label !== undefined
            })
            .on('cellover', cellover)
            .on('cellout', cellout)
            .scale(ordinal);

        legendSVG.select(".legendOrdinal")
            .call(legendOrdinal);

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        }

        // Highlights the list
        function cellover(d) {
            d3.select('[data-legend=' + d + ']')
                .style('stroke-width', 5);
        }

        // Sets width back to regular
        function cellout(d) {
            d3.select('[data-legend=' + d + ']')
                .style('stroke-width', 1);
        }

    }

    render() {

        const {collections} = this.props.data;

        const collectionName = 'Scorecard';
        return (

            <div className="scorecard">
                <div key={collectionName} className="scorecard__item">
                    <h2 className="word-cloud__label">{collectionName}</h2>
                    <svg ref={(svg) => {
                        Scorecard.renderScorecard(svg, collections);
                    }}/>
                </div>
            </div>
        );
    }
}

export default Scorecard;
