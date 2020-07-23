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
    }
};

const install = function (Vue) {
    for (const key of Object.keys(filters)) {
        Vue.filter(key, filters[key]);
    }
};

export default install;
