import Vue from 'vue';
import App from './App';
import Request from './request';
import { RouterMount } from 'uni-simple-router';
import router from './router';
import store from './store';
import commons from './commons';
import uView from 'uview-ui';
import comTarBar from './components/com-tabbar/index.vue';
import comWaterMarker from './components/com-watermarker';

Vue.use(Request);
Vue.use(uView);
Vue.component('com-tabbar', comTarBar);
Vue.component('com-watermarker', comWaterMarker);
Vue.prototype.$store = store;
Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App,
    store
});

// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount();
// #endif
