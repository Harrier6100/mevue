import { createStore } from 'vuex';
import credentials from './modules/credentials';
import roles from './modules/roles';
import queryString from './modules/queryString';

const store = createStore({
    state() {
        return {
            isLoading: false,
        };
    },
    mutations: {
        startLoading(state) {
            state.isLoading = true;
        },
        stopLoading(state) {
            state.isLoading = false;
        },
    },
    modules: {
        credentials,
        roles,
        queryString,
    },
});

export default store;