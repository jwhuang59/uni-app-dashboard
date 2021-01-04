const filters = {
    /**
     * 格式化时间
     * @param {时间} time
     * @param {类型} type
     * @param {链接符} join
     */
    dateFormatFilter(time) {
        if (!time) return '';
        const date = new Date(time);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let min = date.getMinutes();
        let s = date.getSeconds();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        min = min < 10 ? '0' + min : min;
        s = s < 10 ? '0' + s : s;

        return m + '/' + d + '/' + y + ' ' + h + ':' + min;
    },
    // 金额格式化
    moneyFormatFilter(num) {
        if (!num) return '0';
        if (num.toString().indexOf('.') === -1) {
            return (num || '').toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        } else {
            const moneyArr = num.toString().split('.');
            const integer = (moneyArr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            const decimal = moneyArr[1].substring(0, 2);

            return integer + '.' + decimal;
        }
    }
};

const install = function (Vue) {
    for (const key of Object.keys(filters)) {
        Vue.filter(key, filters[key]);
    }
};

export default install;
