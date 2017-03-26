import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'react-select/dist/react-select.css';
import './styles/index.scss';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';
import Root from './Root';
import stores from './stores';
import routes from './routes';

const renderApp = (appRoutes) => {
    render(
        <AppContainer>
            <Provider {...stores}>
                <Root routes={appRoutes} />
            </Provider>
        </AppContainer>,
        document.getElementById('root')
    );
};

renderApp(routes);

if (module.hot) {
    module.hot.accept('./routes', () => {
        const newRoutes = require('./routes').default;
        renderApp(newRoutes);
    });
}
