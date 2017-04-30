import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LoadingIndicator from '../../LoadingIndicator';
import Notification from '../../Notification';

@inject('notifications')
@inject('app')
@observer
class App extends Component {

    componentWillMount() {
        this.props.app.initializeState();
    }

    render() {

        const { children, app } = this.props;
        const { currentNotifications } = this.props.notifications;

        return (
            <div className="app">
                <ul className="app__notification-list">
                    <ReactCSSTransitionGroup transitionName="slide-down-fade-out" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                        {currentNotifications.map((notification) => (
                            <li key={notification.id} className="app__notification-item">
                                <Notification {...notification} />
                            </li>
                        ))}
                    </ReactCSSTransitionGroup>
                </ul>
                {app.isLoading ? (
                    <LoadingIndicator />
                ) : children}
            </div>
        );
    }
}

export default App;
