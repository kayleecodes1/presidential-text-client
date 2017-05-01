import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import * as d3 from 'd3';
import * as scaleChromatic from 'd3-scale-chromatic';
import ReactTooltip from 'react-tooltip';

@observer
@inject('reports')
class Cluster extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    render() {

        const collections = toJS(this.props.data.collections);

        const colorScale = d3.scaleOrdinal(scaleChromatic.schemeSet1)
            .domain(Object.keys(collections));

        return (
            <div className="classify">
                {Object.keys(collections).map((collectionName) => (
                    <div key={collectionName} className="classify__class">
                        <div className="classify__header-bar" style={{ background: colorScale(collectionName) }}></div>
                        <div className="classify__header-title">{collectionName}</div>
                        <ul className="classify__documents-list">
                            {Object.keys(collections[collectionName].result.classify).map((documentId) => (
                                <li key={documentId} data-tip data-for={`${collectionName}:${documentId}`} className="classify__document-node" style={{ background: colorScale(collections[collectionName].result.classify[documentId]) }}>{documentId}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                {Object.keys(collections).map((collectionName) => (
                    Object.keys(collections[collectionName].result.classify).map((documentId) => (
                        <ReactTooltip key={`${collectionName}:${documentId}`} id={`${collectionName}:${documentId}`}>{this.props.reports.getDocumentTitle(documentId)}</ReactTooltip>
                    ))
                ))}
            </div>
        );
    }
}

export default Cluster;
