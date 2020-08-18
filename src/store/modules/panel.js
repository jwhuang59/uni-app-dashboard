const SAVE_USER_INFO = 'save_user_info';

const state = {
    userInfo: ''
};

const mutations = {
    [SAVE_USER_INFO](state, { playload }) {
        state.userInfo = playload;
    }
};

const actions = {};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
};
