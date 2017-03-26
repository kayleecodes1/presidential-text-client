import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';

@inject('notifications')
@observer
class Notification extends Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        notificationType: PropTypes.oneOf(['success', 'warning', 'error']).isRequired,
        message: PropTypes.string.isRequired
    };

    render() {

        const { id, notificationType, message } = this.props;
        const { hideNotification } = this.props.notifications;

        return (
            <div className={`notification notification--${notificationType}`}>
                <button className="notification__close-button" onClick={() => hideNotification(id)}>
                    <i className="fa fa-times" />
                </button>
                <div className="notification__message">{message}</div>
            </div>
        );
    }
}

export default Notification;
