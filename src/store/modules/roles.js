import api from '@/services/api';

const roles = {
    state: {
        permissions: {}
    },
    mutations: {
        setPermissions(state, payload) {
            state.permissions = payload;
        },
    },
    actions: {
        async fetchPermissions({ commit, rootState }) {
            try {
                const { userId } = rootState.credentials.user;
                const response = await api.get(`/api/roles/${userId}`);
                commit('setPermissions', response.permissions);
            } catch (error) {
                console.log(error);
            }
        },
    },
    getters: {
        permissions: (state) => (routeName) => state.permissions[routeName] || {},
    },
};

export default roles;