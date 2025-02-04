const queryString = {
    state: {
        queryString: null,
    },
    mutations: {
        setQuery(state, payload) {
            state.queryString = payload;
        },
    },
    getters: {
        getQuery: (state) => state.queryString,
    },
};

export default queryString;