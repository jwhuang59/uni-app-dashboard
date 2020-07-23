const SAVE_SHOP_INFO = 'save_shop_info';

const state = {
    shop: {
        name: ''
    }
};

const mutations = {
    [SAVE_SHOP_INFO](state, { playload }) {
        state.shop = playload;
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
