import React, { Component, PropTypes } from 'react';
import { toJS } from 'mobx';
import * as d3 from 'd3';

const WIDTH = 800;
const HEIGHT = 400;

const CHART_COLORS = [
    //'#E1F5FE',
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

class Cluster extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderCluster(svg, data) {

        if (svg === null) {
            return;
        }

        const layout = d3.cluster()
            .size([HEIGHT, WIDTH - 160]);

        const root = d3.hierarchy(data, (d) => d.children && d.children.length ? d.children : null);
            //.sort() ?

        layout(root);

        console.log(root.descendants());

        const canvas = d3.select(svg)
            .attr('class', 'cluster__chart')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

        const group = canvas.append('g')
            .attr('transform', `translate(40,0)`);

        const link = group.selectAll('.cluster__link')
            .data(root.descendants().slice(1))
            .enter()
            .append('path')
            .attr('class', 'cluster__link')
            .attr('d', (d) => {
                return `M${d.y},${d.x} L${d.parent.y},${d.x} L${d.parent.y},${d.parent.x}`;
                return `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ` +
                    `${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`;
            });

        const node = group.selectAll('.cluster__node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', (d) => 'cluster__node' + (!d.children ? ' cluster__node--leaf' : ''))
            .attr('transform', (d) => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('r', 2.5);

        node.append('text')
            .attr('dy', 3)
            .attr('x', (d) => d.children ? -8 : 8)
            .style('text-anchor', (d) => d.children ? 'end' : 'start')
            .text((d) => d.data.name);
    }

    render() {

        const { result } = this.props.data;

        return (
            <div className="word-cloud">
                <svg ref={(svg) => { Cluster.renderCluster(svg, toJS(result)); }} />
            </div>
        );
    }
}

export default Cluster;
