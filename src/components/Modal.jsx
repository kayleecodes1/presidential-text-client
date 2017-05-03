import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LoadingIndicator from './LoadingIndicator';

class Modal extends Component {

    static nextId = 1;

    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        windowSize: PropTypes.oneOf(['small']),
        title: PropTypes.string.isRequired,
        renderContent: PropTypes.func.isRequired,
        renderFooter: PropTypes.func,
        isLoading: PropTypes.bool,
        closeFunction: PropTypes.func
    };

    static defaultProps = {
        windowSize: null,
        isLoading: false,
        closeFunction: () => {}
    };

    constructor() {
        super();
        this.id = Modal.nextId++;
        this.handleKeydown = (event) => {
            if (event.keyCode === 27) {
                this.props.closeFunction();
            }
        };
    }

    componentWillMount() {
        window.addEventListener('keydown', this.handleKeydown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
    }

    render() {

        const { isVisible, windowSize, title, renderContent, renderFooter, isLoading, closeFunction } = this.props;
        
        let element = null;

        if (isVisible) {

            const titleId = `modal-${this.id}-title`;
            element = (
                <div key={`modal-${this.id}`} className="modal" role="dialog" aria-labelledby={titleId} onClick={closeFunction}>
                    <div className={classNames('modal__window', { [`modal__window--${windowSize}`]: windowSize })} onClick={(event) => event.stopPropagation()}>
                        <div className="modal__header">
                            <h1 id={titleId} className="modal__title">{title}</h1>
                            <button className="modal__close-button" aria-label="Close" onClick={closeFunction} >
                                <i className="fa fa-times" />
                            </button>
                        </div>
                        <div className={classNames('modal__body', { 'modal__body--no-footer': !renderFooter, 'modal__body--loading': isLoading })}>
                            {isLoading ? (
                                <LoadingIndicator />
                            ) : renderContent()}
                        </div>
                        {renderFooter ? (
                            <div className="modal__footer">
                                {!isLoading ? renderFooter() : null}
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        }

        return (
            <ReactCSSTransitionGroup transitionName="fade-in-out" transitionAppear={true} transitionAppearTimeout={200} transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                {element}
            </ReactCSSTransitionGroup>
        );
    }
}

export default Modal;
