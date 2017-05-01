import React, { Component, PropTypes } from 'react';
import { toJS } from 'mobx';
import * as d3 from 'd3';
import tip from 'd3-tip';
d3.tip = tip;

const WIDTH = 800;
const HEIGHT = 400;

const COLORS = [
    '#333',
    '#666',
    '#999',
    '#CCC'
];

class Cluster extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderCluster(_svg, data) {

        if (_svg === null) {
            return;
        }
        const svg = d3.select(_svg);

        const layout = d3.cluster()
            .size([HEIGHT, WIDTH - 160]);

        const root = d3.hierarchy(data, (d) => d.children && d.children.length ? d.children : null);
            //.sort() ?

        layout(root);

        const tip = d3.tip()
            .attr('class', 'cluster__tooltip')
            .direction('s')
            .offset([10, 0])
            .html((d) => d.data.documentTitles.join('<br />'));
        svg.call(tip);

        const canvas = svg
            .attr('class', 'cluster__chart')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

        const group = canvas.append('g')
            .attr('transform', 'translate(40,0)');

        const link = group.selectAll('.cluster__link')
            .data(root.descendants().slice(1))
            .enter()
            .append('path')
            .attr('class', 'cluster__link')
            .attr('d', (d) => {
                return `M${d.y},${d.x} L${d.parent.y},${d.x} L${d.parent.y},${d.parent.x}`;
            });

        const node = group.selectAll('.cluster__node')
            .data(root.descendants());
        const nodeEnter = node.enter()
            .append('circle')
            .attr('class', (d) => 'cluster__node' + (d.children && d.children.length ? ' cluster__node--leaf' : ''))
            .attr('r', 3)
            .attr('transform', (d) => `translate(${d.y},${d.x})`)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //TODO hover for d.documentTitles
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
