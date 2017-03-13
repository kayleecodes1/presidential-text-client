import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing')
@inject('app')
@observer
class Speakers extends Component {

    render() {

        //const { location, push, goBack } = this.props.routing;

        return (
            <div className="speakers">
                SPEAKERS
            </div>
        );
    }
}

export default Speakers;
