const state = {
    selectedList: [],
    current: {},
    running: false,
    pw: ''
};

const mutations = {
    SET_SELECTED_LIST (state, payload) {
        state.selectedList = payload;
    },
    SET_CURRENT (state, payload) {
        state.current = payload;
    },
    SET_NGINX_STATUS (state, payload) {
        state.running = payload;
    },
    SET_USER_PW (state, payload) {
        state.pw = payload;
    }
};

const actions = {
    someAsyncTask ({commit}) {
        // do something async
        commit('GET_SELECTE_LIST')
    }
};

export default {
    state,
    mutations,
    actions
}
