import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@inject('routing')
@inject('app')
@observer
class App extends Component {

    //TODO: on mount, fetch user data

    render() {

        const { children/*, location*/ } = this.props;

        /*<ReactCSSTransitionGroup
         component="div"
         transitionName="fade-in-out-swap"
         transitionEnterTimeout={400}
         transitionLeaveTimeout={200}>
         {React.cloneElement(children, {
         key: location.pathname
         })}
         </ReactCSSTransitionGroup>*/

        return (
            <div className="app">
                {children}
            </div>
        );
    }
}

export default App;
