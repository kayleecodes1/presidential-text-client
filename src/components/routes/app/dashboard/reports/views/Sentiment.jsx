import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';

class Sentiment extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderSentiment(svg, sentiments) {

        const d3Tip = require('d3-tip');
        /*
         Turn data into csv string
         */
        let vals = '';
        vals += 'name,value\n'
        for (let k in sentiments) {
            vals += k + ',';
            vals += sentiments[k].result.sentiment + '\n';
        }

        /*
         Add tool tip
         */

        let tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                let col = "";
                if(d.value < 0){
                    col = 'red';
                }else{
                    col = 'steelblue';
                }
            return '<strong>' + d.name + ':</strong> <span style=\'color:' + col + '\'>' + parseFloat(d.value).toFixed(4) + '</span>';
        });
        /*
         Set svg dimensions
         */

        let margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        svg = d3.select('svg')
            .attr('width', 960)
            .attr('height', 600);

        let g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.call(tip);
        /*
         Parse csv string into csv data
         */
        const data = d3.csvParse(vals);


        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear()
                .domain([-1,1])
                .rangeRound([height, 0]);
        /*
         Create chart
         */
        x.domain(data.map(function (d) {
            return d.name;
        }));
        /*y.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);*/

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Frequency');

        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', function(d){
                if(d.value > 0){
                    return 'bar positive';
                }else{
                    return 'bar negative';
                }
            })

            .attr('x', function (d) {
                return x(d.name);
            })
            .attr('y', function (d) {
                if(d.value > 0) {
                    return y(d.value);
                }else{
                    return y(0);
                }
            })
            .attr('width', x.bandwidth())
            .attr('height', function (d) {
                return (Math.abs(y(d.value) - y(0)));
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


    }

    render() {

        const {collections} = this.props.data;

        const collectionName = 'Sentiment';
        return (

            <div className='sentiment'>

                <div key={collectionName} className='sentiment__item'>
                    <h2 className='word-cloud__label'>{collectionName}</h2>
                    <svg ref={(svg) => {
                        Sentiment.renderSentiment(svg, collections);
                    }}/>
                </div>

            </div>
        );
    }
}

export default Sentiment;