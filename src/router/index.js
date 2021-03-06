import Vue from 'vue';
import Router from 'uni-simple-router';
import routes from './modules';

Vue.use(Router);

const router = new Router({
    encodeURI: true,
    routes
});

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
    next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {});

export default router;
