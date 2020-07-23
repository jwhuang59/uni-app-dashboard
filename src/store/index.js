import Vue from 'vue';
import Vuex from 'vuex';
import states from './modules';

Vue.use(Vuex);

const modules = {
    state: {},
    mutation: {},
    action: {},
    getters: {}
};

states.forEach(item => {
    modules.state = Object.assign({}, modules.state, item.state);
    modules.mutations = Object.assign({}, modules.mutations, item.mutations);
    modules.actions = Object.assign({}, modules.actions, item.actions);
    modules.getters = Object.assign({}, modules.getters, item.getters);
});

const store = new Vuex.Store(modules);
console.log(store);
export default store;
