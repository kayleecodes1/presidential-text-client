import React, { Component, PropTypes } from 'react';
import LoadingIndicator from './LoadingIndicator';

class Modal extends Component {

    static nextId = 1;

    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.element.isRequired,
        footer: PropTypes.element,
        isLoading: PropTypes.bool,
        closeFunction: PropTypes.func
    };

    static defaultProps = {
        isLoading: false,
        closeFunction: () => {}
    };

    constructor() {
        super();
        this.id = LoadingIndicator.nextId++;
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

        const { title, content, footer, isLoading, closeFunction } = this.props;

        const titleId = `modal-${this.id}-title`;

        return (
            <div key={`modal-${this.id}`} className="modal" role="dialog" aria-labelledby={titleId} onClick={closeFunction}>
                <div className="modal__window" onClick={(event) => event.stopPropagation()}>
                    <div className="modal__header">
                        <h1 id={titleId} className="modal__title">{title}</h1>
                        <button className="modal__close-button" aria-label="Close" onClick={closeFunction} >
                            <i className="fa fa-times" />
                        </button>
                    </div>
                    <div className="modal__body">
                        {isLoading ? (
                            <div className="modal__loading-stretcher">
                                <LoadingIndicator />
                            </div>
                        ) : content}
                    </div>
                    {footer ? (
                        <div className="modal__footer">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Modal;
