<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import dayjs from 'dayjs';
let _self;
export default {
    data() {
        return {
            currentTime: '', // 当前时间
            flexHeight: '', // 水印高度
            waterMarkerText: '' // 水印内容
        };
    },
    created() {
        this.getCurrentTime();
        this.waterMarkerText = '锅圈数坊';
    },
    onLoad() {
        _self = this;
        // 下个半小时刷新
        const getMinute = dayjs().minute();
        const surplusMinutes = getMinute > 30 ? (60 - getMinute) * 60000 : (30 - getMinute) * 60000;
        setTimeout(() => {
            this.getSetTimeout();
        }, surplusMinutes);
    },
    mounted() {
        const flexInfo = uni.createSelectorQuery().select('.content');
        flexInfo
            .boundingClientRect(data => {
                _self.flexHeight = data.height;
            })
            .exec();
    },
    methods: {
        // 整半小时刷新
        getSetTimeout() {
            this.getCurrentTime();
            setTimeout(() => {
                _self.getSetTimeout();
            }, 1800 * 1000);
        },
        // 获取当前时间
        getCurrentTime() {
            const getTime =
                dayjs().minute() > 30 ? dayjs().format('YYYY-MM-DD HH:30') : dayjs().format('YYYY-MM-DD HH:00');
            this.currentTime = getTime;
            return dayjs(getTime).valueOf(); // 最新时间戳
        }
    }
};
</script>
