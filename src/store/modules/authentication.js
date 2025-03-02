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
            const response = await api.post('/api/token', credentials, { headers: { 'skip-auth': true }});
            const { user, token, refreshToken } = response;
            commit('setAuth', { user, token });
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        },
        autoSignin: async ({ commit }) => {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token && refreshToken) {
                try {
                    const response = await api.post('/api/token/refresh', { refreshToken }, { headers: { 'skip-auth': true }});
                    const { user, token: newToken, refreshToken: newRefreshToken } = response;
                    commit('setAuth', { user, token: newToken });
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                } catch (error) {
                    commit('clearAuth');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                }
            }
        },
        signout({ commit }) {
            commit('clearAuth');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    getters: {
        user: (state) => state.user,
        token: (state) => state.token,
        isAuth: (state) => state.isAuth,
    },
};

export default authentication;