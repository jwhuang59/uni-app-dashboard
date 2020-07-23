/**
 * 全局混入，注意使用！ 一旦使用全局混入对象，将会影响到所有之后创建的Vue实例。
 */
export default {
    computed: {
        btnIsDisabled: function (obj) {
            return function (obj) {
                let result = false;
                for (const key of Object.keys(obj)) {
                    if (!obj[key]) {
                        result = true;
                        break;
                    }
                }
                return result;
            };
        }
    },
    methods: {
        /**
         * 按钮拦截--和btnIsDisabled函数配合使用，常用于表单必填项为空时按钮置灰场景
         * @param {*} bool
         * @param {*} callback
         */
        btnInterceptor(bool, callback) {
            if (!bool) {
                callback();
            }
        },

        /**
         * Tab级跳转
         * @param {路径名称} name
         */
        jumpTab(name) {
            const route = { name };
            this.$Router.pushTab(route);
        },

        /**
         * 页面级跳转
         * @param {路径名称} name
         * @param {路径参数} params
         */
        jump(name, params) {
            let route = { name };
            if (params) {
                route = {
                    name,
                    params
                };
            }
            this.$Router.push(route);
        },

        /**
         * 路由返回
         */
        back() {
            this.$Router.back();
        },

        /**
         * 获取路由参数
         */
        getRouteParams() {
            return this.$Route.query;
        },

        /**
         * 获取网络图片
         * @param {*} name
         */
        getImg(name) {
            return `${process.env.VUE_APP_IMG_URL}${name}.png?x-oss-process=image/format,webp`;
        }
    }
};
