import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import * as d3Trans from 'd3-transition';

const WIDTH = 600;
const HEIGHT = 400;

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 100;

const DEF_MAG = 0.5;
const SEL_MAG = 0.75;

const DEF_COL = '#0277BD';
const SEL_COL = '#01579B';

class DistinctWords extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderDistinctWords(svg, data) {

        if (svg === null) {
            return;
        }

        function getFontSize(magnitude){
            return MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * magnitude;
        }
        const [min, max] = d3.extent(data, (key) => data[key]);
        const words = data.map((key) => {
            const magnitude = DEF_MAG;//(data[key] - min) / (max - min);
            const size = getFontSize(magnitude);
            return { text: key, magnitude, size };
        });

        const fill = (word) => {
            //const index = Math.floor(DEF_MAG * (CHART_COLORS.length - 0.1));
            return DEF_COL;
        };

        const layout = cloud()
            .size([WIDTH, HEIGHT])
            .words(words)
            .padding(5)
            .rotate((d) => {
                if (d.size > 50) {
                    return 0;
                }
                return Math.floor(Math.random() * 2) * -90;
            })
            .font('Impact')
            .fontSize((d) => d.size);

        layout.on('end', (words) => {
            const canvas = d3.select(svg)
                .attr('class', 'top-ten__chart')
                .attr('width', WIDTH)
                .attr('height', HEIGHT)
                .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
            const group = canvas.append('g')
                .attr('transform', `translate(${WIDTH / 2},${HEIGHT / 2})`);
            const text = group
                .selectAll('text')
                .data(words)
                .enter().append('text')
                .style('font-size', (d) => `${d.size}px`)
                .style('font-family', 'Impact')
                .style('fill', (d) => fill(d))
                .attr('text-anchor', 'middle')
                .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text((d) => d.text)
                .attr('class', function(d){
                    return 'text-' + d.text;
                });
        });


        layout.start();
    }

    render() {

        const { collections } = this.props.data;

        //TODO

        return (
            <div className="distinct-words">
                {Object.keys(collections).map((collectionName) => (
                    <div key={collectionName} className="distinct-words__item">
                        <h2 className="distinct-words__label">{collectionName}</h2>
                        <svg ref={(svg) => { DistinctWords.renderDistinctWords(svg, collections[collectionName].result.distinct); }} />
                    </div>
                ))}
            </div>
        );
    }
}

export default DistinctWords;
