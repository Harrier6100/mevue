const query = {
    state: {
        query: null,
    },
    mutations: {
        setQuery(state, payload) {
            state.query = payload;
        },
    },
    getters: {
        query: (state) => state.query,
    },
};

export default query;