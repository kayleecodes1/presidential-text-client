import React, {Component, PropTypes} from 'react';
import * as d3 from 'd3';


class UniqueWords extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    static renderUniqueWords(svg, data) {
        if (svg === null) {
            return;
        }
        //svg = d3.select(svg);

        const tbl = d3.select(svg.parentElement).append('div')
                .attr('class', 'tableDiv')
                .append('table')
                .style('display', 'inline'),
            tbody = tbl.append('tbody')
        ;
        const rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr')
            .append('td')
            .html(function (d) {
                return d;
            });
    }

    render() {

        const {collections} = this.props.data;

        //TODO

        return (
            <div className="unique-words">
                {Object.keys(collections).map((collectionName) => (

                    <div key={collectionName} className={`unique-words__item ${collectionName.replace(/\s/g, '')}`}>
                        <h2 className="unique-words__label">{collectionName}</h2>
                        <svg ref={(svg) => {
                            UniqueWords.renderUniqueWords(svg, collections[collectionName].result.unique);
                        }}/>
                    </div>
                ))}
            </div>
        );
    }
}

export default UniqueWords;