// 工具函数库(https://www.html.cn/doc/lodash/)
const cloneDeep = require('lodash/cloneDeep');
const remove = require('lodash/remove');
const pullAll = require('lodash/pullAll');
const isEmpty = require('lodash/isEmpty');
const isNaN = require('lodash/isNaN');
const isNumber = require('lodash/isNumber');
// 时间库(https://github.com/iamkun/dayjs)
const dayjs = require('dayjs');

/**
 * 检查val是否不为空，0被认为不为空，undefined/null/NaN/{}/[]都会被认为空
 * @param {*} val
 */
const isNotEmpty = val => {
    if (isNaN(val)) {
        return false;
    }
    if (isNumber(val)) {
        return true;
    }
    return !isEmpty(val);
};

/**
 * 将val值按照format进行格式化
 * @param {*} val
 * @param {*} format
 */
const format = (val, format = 'YYYY-MM-DD') => {
    return dayjs(val).format(format);
};

const Utils = {
    cloneDeep,
    remove,
    pullAll,
    isNotEmpty,
    format
};

const install = function (Vue) {
    Vue.prototype.$utils = Utils;
};

export default install;
