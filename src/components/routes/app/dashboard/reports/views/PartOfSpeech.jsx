import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale-chromatic';
import * as d3Legend from 'd3-svg-legend';

class PartOfSpeech extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderPOS(svg, partsOfSpeech) {

        var initStackedBarChart = {
            draw: function (config) {

                const colorScheme = d3Scale.schemePaired;

                /*
                 Begin Setting up chart
                 */
                const countOfLists = config.data.length;
                const me = this,
                    domEle = config.element,
                    stackKey = config.key,
                    data = config.data,
                    margin = {top: 20, right: 20, bottom: 30, left: 50},
                    formatPercent = d3.format('.0%'),
                    width = 960 - margin.left - margin.right,
                    height = (75 * countOfLists) - margin.top - margin.bottom,
                    xScale = d3.scaleLinear().rangeRound([0, width]),
                    yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1),
                    color = d3.scaleOrdinal(colorScheme),
                    xAxis = d3.axisTop(xScale).tickFormat(formatPercent),
                    yAxis = d3.axisLeft(yScale),
                    svg = d3.select('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                const stack = d3.stack()
                    .keys(stackKey)
                    .offset(d3.stackOffsetNone);

                const layers = stack(data);
                data.sort(function (a, b) {
                    return b.total - a.total;
                });
                yScale.domain(data.map(function (d) {
                    return d.list;
                }));
                xScale.domain([0, 1]).nice();

                const layer = svg.selectAll('.layer')
                    .data(layers)
                    .enter().append('g')
                    .attr('class', function (d, i) {
                        let dd = d;
                        let ii = i;
                        return 'layer'
                    })
                    .style('fill', function (d, i) {
                        return color(i);
                    });

                layer.selectAll('rect')
                    .data(function (d) {
                        return d;
                    })
                    .enter().append('rect')
                    .attr('class', function (d) {
                        if (d[0] === 0) {
                            return 'first-rect-' + d.data.list;
                        }
                    })
                    .attr('y', function (d) {
                        return yScale((d.data.list)) + 10;
                    })
                    .attr('x', function (d) {
                        return xScale(d[0]);
                    })
                    .attr('height', yScale.bandwidth() * 0.70)
                    .attr('width', function (d) {
                        return xScale(d[1]) - xScale(d[0])
                    })
                    .attr('class', function () {
                        const dd = d3.select(this.parentNode).datum();
                        return 'rect-' + dd.key;
                    })
                    .style('margin-top', '10px')
                    .on("mouseover", function () {
                        const dd = d3.select(this.parentNode).datum();
                        const sel = '.text-' + dd.key;
                        d3.selectAll(sel)
                            .style('fill', 'black');
                    })
                    .on("mouseout", function () {
                        const dd = d3.select(this.parentNode).datum();
                        const sel = '.text-' + dd.key;
                        d3.selectAll(sel)
                            .style('fill', color(dd.index)  );
                    })
                ;

                // Add List Labels
                const txt = svg.selectAll('text')
                    .data(data)
                    .enter().append('text')
                    .attr('class', 'list-name')
                    .attr('y', function (d) {
                        return yScale(d.list) + 10;
                    })
                    .attr('x', 0)
                    .text(function (d) {
                        return d.list;
                    })
                    .style('fill', '#696B6E')
                    .style('font-weight', 'bold');

                layer.selectAll('text')
                    .data(function (d) {
                        return d;
                    })
                    .enter().append('text')
                    .attr('class', function () {
                        const dd = d3.select(this.parentNode).datum();
                        return 'text-' + dd.key;
                    })
                    .attr('y', function (d) {
                        return yScale((d.data.list)) + 15 + yScale.bandwidth() * 0.35;
                    })
                    .attr('x', function (d) {
                        let xStart = xScale(d[0]);
                        let xWidth = xScale(d[1]) - xScale(d[0]);
                        return xScale(d[0]) + (xScale(d[1]) - xScale(d[0])) / 2;
                    })
                    .text(function (d) {
                        return formatPercent(d[1] - d[0]);
                    })
                    .style('fill', function(d){
                        const dd = d3.select(this.parentNode).datum();
                        color(dd.i);
                    })
                    .style('font-weight', 'bold');


                svg.append('g')
                    .attr('class', 'axis axis--x')
                    //.attr('transform', 'translate(0,' + (height + 5) + ')')
                    .attr('transform', 'translate(0,0)')

                    .call(xAxis);

                /*  ==========
                 Add Legend
                 ========== */

                let ordDomain = config.key;


                let ordinal = d3.scaleOrdinal(colorScheme)
                    .domain(ordDomain);

                let legendSVG = d3.select('.part-of-speech__item')
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
                    //.on('cellover', cellover)
                    //.on('cellout', cellout)
                    .scale(ordinal);

                legendSVG.select(".legendOrdinal")
                    .call(legendOrdinal);


            }

        }

        let lists = [];
        let data = [];
        let dataObj = {};
        let objForKeys = {};
        let key = [];
        for (let k in partsOfSpeech) {
            lists.push(k);
            dataObj = partsOfSpeech[k].result.pos;

            // Get Total Counts
            let tot = 0;
            for (let kk in dataObj) {
                tot += dataObj[kk];
            }

            // Change Values to Percentages
            for (let kk in dataObj) {
                let cnt = dataObj[kk];
                dataObj[kk] = cnt / tot;
            }

            // On first pass, add the key fields
            if (key.length === 0) {
                for (let kk in dataObj) {
                    key.push(kk);
                }
            }
            // Add list name and total amount
            dataObj.list = k;
            dataObj.total = 1;
            data.push(dataObj);
        }

        initStackedBarChart.draw({
            data: data,
            key: key,
            element: 'stacked-bar'
        });
    }

    render() {

        const {collections} = this.props.data;

        //TODO
        const collectionName = 'Part of Speech';
        return (
            <div className="part-of-speech">

                <div key={collectionName} className="part-of-speech__item">
                    <h2 className="top-ten__label">{collectionName}</h2>
                    <svg ref={(svg) => {
                        PartOfSpeech.renderPOS(svg, collections);
                    }}/>
                </div>

            </div>
        );
    }
}
export default PartOfSpeech;