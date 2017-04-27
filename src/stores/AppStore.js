import { observable, action } from 'mobx';
import { checkAuth, login } from '../services/api/authentication';

class AppStore {

    @observable isLoading = false;
    @observable currentUser = null;
    @observable isProcessingLogin = false;
    @observable loginErrorText = '';

    @action.bound
    initializeState() {
        
        this.isLoading = true;
        checkAuth()
            .then((username) => {
                this.currentUser = username;
            })
            .catch((error) => {
                // do nothing
            })
            .then(() => {
                this.isLoading = false;
            });

        window.addEventListener('app.unauthorized', () => {
            this.currentUser = null;
        });
    }

    @action.bound
    login(username, password) {

        if (username === '') {
            this.loginErrorText = 'Please enter a username.';
            return;
        }
        if (password === '') {
            this.loginErrorText = 'Please enter a password.';
            return;
        }

        this.isProcessingLogin = true;
        this.loginErrorText = '';
        login(username, password)
            .then((username) => {
                this.currentUser = username;
            })
            .catch((err) => {
                this.loginErrorText = err.message;
            })
            .then(() => {
                this.isProcessingLogin = false;
            });
    }
}

export default AppStore;
