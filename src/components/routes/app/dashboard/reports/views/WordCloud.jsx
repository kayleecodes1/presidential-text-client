import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WIDTH = 600;
const HEIGHT = 400;

const CHART_COLORS = [
    '#E1F5FE',
    '#B3E5FC',
    '#81D4FA',
    '#4FC3F7',
    '#29B6F6',
    '#03A9F4',
    '#039BE5',
    '#0288D1',
    '#0277BD',
    '#01579B'
];

class WordCloud extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderWordCloud(svg, data) {

        if (svg === null) {
            return;
        }

        const words = data.map((d) => {
            const parts = d.split(': ');
            return { text: parts[0], size: parseFloat(parts[1]) * 100 };
        });

        const [min, max] = d3.extent(words, (d) => d.size);
        const fill = (size) => {
            const t = (size - min) / (max - min);
            const index = Math.floor(t * CHART_COLORS.length);
            return CHART_COLORS[index];
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
                .attr('class', 'word-cloud__chart')
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
                .style('fill', (d) => fill(d.size))
                .attr('text-anchor', 'middle')
                .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text((d) => d.text);
        });

        layout.start();
    }

    render() {

        const { collections } = this.props.data;

        //TODO

        return (
            <div className="word-cloud">
                {Object.keys(collections).map((collectionName) => (
                    <div key={collectionName} className="word-cloud__item">
                        <h2 className="word-cloud__label">{collectionName}</h2>
                        <svg ref={(svg) => { WordCloud.renderWordCloud(svg, collections[collectionName].result.wordcloud); }} />
                    </div>
                ))}
            </div>
        );
    }
}

export default WordCloud;
