import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Notification from '../../Notification';

@inject('notifications')
@observer
class App extends Component {

    //TODO: on mount, fetch user data

    render() {

        const { children } = this.props;
        const { currentNotifications } = this.props.notifications;

        return (
            <div className="app">
                {children}
                <ul className="app__notification-list">
                    <ReactCSSTransitionGroup transitionName="slide-down-fade-out" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                        {currentNotifications.map((notification) => (
                            <li key={notification.id} className="app__notification-item">
                                <Notification {...notification} />
                            </li>
                        ))}
                    </ReactCSSTransitionGroup>
                </ul>
            </div>
        );
    }
}

export default App;
