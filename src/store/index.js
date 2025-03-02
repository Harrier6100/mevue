import { createStore } from 'vuex';
import authentication from './modules/authentication';
import query from './modules/query';

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
    getters: {
        isLoading: (state) => state.isLoading,
    },
    modules: {
        authentication,
        query,
    },
});

export default store;