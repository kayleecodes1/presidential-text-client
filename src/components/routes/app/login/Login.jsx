import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import LoadingIndicator from '../../../LoadingIndicator';

@inject('routing')
@inject('app')
@observer
class Login extends Component {

    constructor(props) {

        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.redirectIfLoggedIn(this.props);
    }

    componentWillUpdate(nextProps) {
        this.redirectIfLoggedIn(nextProps);
    }

    redirectIfLoggedIn(props) {
        if (props.app.currentUser !== null) {
            this.props.routing.push('/');
        }
    }

    handleChange(event) {

        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {

        event.preventDefault();

        if (this.props.app.isProcessingLogin) {
            return;
        }

        this.props.app.login(this.state.email, this.state.password);
    }

    render() {

        this.props.app.currentUser;//TODO: ... this is needed to trigger update

        const { isProcessingLogin, loginErrorText } = this.props.app;
        const { email, password } = this.state;

        return (
            <div className="login">
                <form id="form-login" className="login__form" onSubmit={this.handleSubmit}>
                    <div className={classNames('login__form-content', { 'login__form-content--hidden': isProcessingLogin })}>
                        <h1 className="login__heading">Sign In</h1>
                        {loginErrorText ? (
                            <div className="login__error">{loginErrorText}</div>
                        ) : null}
                        <label className="login__label" htmlFor="email">Email Address</label>
                        <input className="login__input" type="text" name="email" value={email} onChange={this.handleChange} />
                        <label className="login__label" htmlFor="password">Password</label>
                        <input className="login__input" type="password" name="password" value={password} onChange={this.handleChange} />
                        <button className="button button--primary login__submit-button" form="form-login">Sign In</button>
                    </div>
                    <ReactCSSTransitionGroup transitionName="fade-in-out-swap" transitionEnterTimeout={400} transitionLeaveTimeout={200}>
                        {isProcessingLogin ? <LoadingIndicator /> : null}
                    </ReactCSSTransitionGroup>
                </form>
            </div>
        );
    }
}

export default Login;
