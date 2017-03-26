import { observable, action } from 'mobx';
import { login, logout } from '../services/api/authentication';

class AppStore {

    @observable currentUser = null;
    @observable isProcessingLogin = false;
    @observable loginErrorText = '';

    @action.bound
    login(email, password) {

        this.isProcessingLogin = true;
        login(email, password)
            .then((userData) => {
                this.currentUser = userData;
            })
            .catch((err) => {
                this.loginErrorText = err.message;
            })
            .then(() => {
                this.isProcessingLogin = false;
            });
    }

    @action.bound
    logout() {

        logout()
            .then(() => {
                this.currentUser = null;
            });
    }
}

export default AppStore;
