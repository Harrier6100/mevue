import api from '@/services/api';

const authentication = {
    state: {
        user: null,
        token: null,
        isAuth: false,
    },
    mutations: {
        setAuth(state, payload) {
            state.user = payload.user;
            state.token = payload.token;
            state.isAuth = true;
        },
        clearAuth(state) {
            state.user = null;
            state.token = null;
            state.isAuth = false;
        },
    },
    actions: {
        signin: async ({ commit }, credentials) => {
            try {
                const response = await api.post('/api/token', credentials, {
                    headers: { 'skip-auth': true },
                    withCredentials: true,
                });
                const { user, token } = response;
                commit('setAuth', { user, token });
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('サインインエラー:', error);
                throw error;
            }
        },
        autoSignin: async ({ commit }) => {
            const token = localStorage.getItem('token');
            console.log(token);
            if (!token) return;

            try {
                const response = await api.post('/api/token/refresh', {}, {
                    headers: { 'skip-auth': true },
                    withCredentials: true,
                });
                const { user, token: newToken } = response;
                commit('setAuth', { user, token: newToken });
                localStorage.setItem('token', newToken);
            } catch (error) {
                commit('clearAuth');
                localStorage.removeItem('token');
            }
        },
        signout: async ({ commit }) => {
            await api.post('/api/token/clear', {}, {
                headers: { 'skip-auth': true },
                withCredentials: true,
            });
            commit('clearAuth');
            localStorage.removeItem('token');
        },
    },
    getters: {
        user: (state) => state.user,
        token: (state) => state.token,
        isAuth: (state) => state.isAuth,
    },
};

export default authentication;