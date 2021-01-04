import CryptoJS from '../libs/crypto.js';
import apis from './modules';
import utils from '../commons/utils';

let BaseUrl = '';

// #ifdef H5
BaseUrl = '/api';
// #endif

// #ifdef MP-WEIXIN
BaseUrl = process.env.VUE_APP_BASE_URL;
// #endif

let httpCount = 0;

/**
 * 封装http请求函数
 * @param {请求名称} name
 * @param {接口入参} data
 */
const request = function (name = '', data = {}) {
    let { url, method = 'post', header = { 'content-type': 'application/json' }, pem = false, sld = true } = getApi(
        name
    );
    const that = this;
    header = getHeader(header, data);
    url = BaseUrl + url;
    return new Promise((resolve, reject) => {
        if (httpCount === 0 && sld) {
            uni.showLoading({
                title: '加载中'
            });
        }
        httpCount++;
        uni.request({
            url,
            header,
            method,
            data,
            success(res) {
                if (res.data.success) {
                    resolve(res.data);
                } else if (res.data.code === 500) {
                    // todo 请求超时
                    that.jump('noFound');
                    uni.hideLoading();
                } else {
                    errorHandler(res, reject, pem);
                }
            },
            fail: err => {
                errorHandler(err, reject, pem);
            },
            complete() {
                httpCount--;
                if (httpCount === 0) {
                    // uni.hideLoading();
                }
            }
        });
    });
};

/**
 * 接口错误数据处理函数
 * @param {接口返回数据} res
 * @param {Promise错误处理函数} reject
 * @param {是否处理错误：true 由页面自行处理 false 统一拦截处理} pem
 */
const errorHandler = function (res, reject, pem) {
    if (!pem) {
        const title = res.hasOwnProperty('data') ? res.data.msg : res.errMsg;
        uni.showToast({
            title,
            icon: 'none',
            duration: 3000
        });
    } else {
        reject(res);
    }
};

/**
 * 封装请求头部信息
 * @param {头部信息} header
 * @param {接口入参} data
 */
const getHeader = function (header, data) {
    const reqtime = Date.now();
    const terminal = uni.getSystemInfoSync().system.indexOf('iOS') > -1 ? 2 : 1;
    const sign = getSign(reqtime, data);
    const token = uni.getStorageSync('token') || '';
    const channel = uni.getStorageSync('channel') || '';
    const target = {
        clientVersion: '1.0',
        token,
        reqtime,
        sign,
        terminal,
        channel
    };

    return Object.assign({}, target, header);
};

/**
 * 封装接口秘钥
 * @param {时间戳} reqtime
 * @param {接口入参} data
 */
const getSign = function (reqtime, data) {
    const p = 'guoquan.com#2020|' + reqtime + '|' + JSON.stringify(data);
    const s = CryptoJS.MD5(p).toString();
    return s;
};

/**
 * 获取请求信息
 * @param {请求名称} name
 */
const getApi = function (name) {
    const api = apis.filter(v => {
        return v.name === name;
    });
    if (api.length === 0) {
        throw new Error(`未找到${name}对应的API服务地址`);
    } else {
        return api[0];
    }
};

/**
 * 封装插件
 * @param {*} Vue
 */
const install = function (Vue) {
    Vue.prototype.$request = request;
};

export default install;
