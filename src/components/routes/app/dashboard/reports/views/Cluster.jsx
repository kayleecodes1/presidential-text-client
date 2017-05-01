import React, { Component, PropTypes } from 'react';
import { toJS } from 'mobx';
import * as d3 from 'd3';
import tip from 'd3-tip';
d3.tip = tip;
import * as scaleChromatic from 'd3-scale-chromatic';
import * as svgLegend from 'd3-svg-legend';

const WIDTH = 800;
const HEIGHT = 400;

class Cluster extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderCluster(_svg, collections, data, colorScale) {

        if (_svg === null) {
            return;
        }
        const svg = d3.select(_svg);

        // Collection lookups.
        const collectionLookups = new Map();
        for (const collectionName of Object.keys(collections)) {
            const lookup = new Set();
            for (const documentId of collections[collectionName].documents) {
                lookup.add(documentId);
            }
            collectionLookups.set(collectionName, lookup);
        }

        // Collection colors.
        const _getColor = (documentId) => {
            for (const collectionName of Object.keys(collections)) {
                if (collectionLookups.get(collectionName).has(documentId)) {
                    return colorScale(collectionName);
                }
            }
            return colorScale(null);
        };

        const layout = d3.cluster()
            .size([HEIGHT, WIDTH - 80]);

        const root = d3.hierarchy(data, (d) => d.children && d.children.length ? d.children : null);
            //.sort() ?

        layout(root);

        const tip = d3.tip()
            .attr('class', 'cluster__tooltip')
            .direction('s')
            .offset([10, 0])
            .html((d) => {
                if (!d.data.documents) {
                    return '';
                }
                const string = [];
                string.push('<ul class="cluster__tooltip-list">');
                for (const document of d.data.documents) {
                    string.push('<li class="cluster__tooltip-item">');
                    string.push(`<div class="cluster__tooltip-shape" style="background: ${_getColor(document.id)};"></div>`);
                    string.push(`<span>${document.title}</span>`);
                    string.push('</li>');
                }
                string.push('<ul>');
                return string.join('');
            });
        svg.call(tip);

        const canvas = svg
            .attr('class', 'cluster__chart')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

        /*const horizontalLegend = svgLegend.legendColor()
            .shapeWidth(16)
            .shapePadding(20)
            .orient('vertical')
            .labelAlign('middle')
            .scale(colorScale);
        const legend = canvas.append('g')
            .attr('transform', `translate(${WIDTH / 2}, 0)`)
            .call(horizontalLegend);*/

        const group = canvas.append('g')
            .attr('transform', 'translate(40, 0)');

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
            .attr('fill', (d) => d.data.leafDocument ? _getColor(d.data.leafDocument.id) : '#999')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //TODO hover for d.documentTitles
    }

    render() {

        const { collections, result } = this.props.data;

        const colorScale = d3.scaleOrdinal(scaleChromatic.schemeSet1)
            .domain(Object.keys(collections));

        return (
            <div className="cluster">
                <ul className="cluster__legend">
                    {Object.keys(collections).map((collectionName) => (
                        <li key={collectionName} className="cluster__legend-item">
                            <div className="cluster__legend-shape" style={{ background: colorScale(collectionName) }}></div>
                            <span>{collectionName}</span>
                        </li>
                    ))}
                </ul>
                <svg className="cluster__chart" ref={(svg) => { Cluster.renderCluster(svg, toJS(collections), toJS(result), colorScale); }} />
            </div>
        );
    }
}

export default Cluster;
