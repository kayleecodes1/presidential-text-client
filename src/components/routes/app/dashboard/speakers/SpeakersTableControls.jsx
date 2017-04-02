import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('speakers')
@observer
class SpeakersTableControls extends Component {

    static propTypes = {
        toggleFilters: PropTypes.func,
        filtersAreVisible: PropTypes.bool
    };

    static defaultProps = {
        toggleFilters: null,
        filtersAreVisible: false
    };

    render() {

        const { toggleFilters, filtersAreVisible } = this.props;
        const {
            resultsPerPage,
            firstResultNumber,
            lastResultNumber,
            totalResults,
            totalPages,
            setResultsPerPage,
            goToPage,
            goToPreviousPage,
            goToNextPage,
            filtersAreEmpty,
            clearFilters
        } = this.props.speakers;

        return (
            <div className="table-controls">
                {toggleFilters ? (
                    <div className="table-controls__left">
                        <button className="button" onClick={toggleFilters}>
                            <i className={classNames('button__icon', 'fa', filtersAreVisible ? 'fa-angle-double-up' : 'fa-angle-double-down')} />
                            <span>{filtersAreVisible ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>
                        <button className="button" onClick={clearFilters} disabled={filtersAreEmpty}>
                            <i className="button__icon fa fa-times" />
                            <span>Clear Filters</span>
                        </button>
                    </div>
                ) : null}
                <div className="table-controls__right">
                    <div className="table-controls__results-control">
                        <span>Rows per page:</span>
                        <select className="table-controls__results-select" value={resultsPerPage} onChange={(event) => setResultsPerPage(event.target.value)}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div className="table-controls__results-count">{firstResultNumber}-{lastResultNumber} of {totalResults}</div>
                    <div className="table-controls__pages-control">
                        <button className="table-controls__page-button" onClick={() => goToPage(1)}>
                            <i className="fa fa-chevron-left" style={{ marginRight: '-3px' }} />
                            <i className="fa fa-chevron-left" />
                        </button>
                        <button className="table-controls__page-button" onClick={goToPreviousPage}>
                            <i className="fa fa-chevron-left" />
                        </button>
                        <button className="table-controls__page-button" onClick={goToNextPage}>
                            <i className="fa fa-chevron-right" />
                        </button>
                        <button className="table-controls__page-button" onClick={() => goToPage(totalPages)}>
                            <i className="fa fa-chevron-right" style={{ marginRight: '-3px' }} />
                            <i className="fa fa-chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpeakersTableControls;
