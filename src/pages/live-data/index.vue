<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
let _self;
export default {
    data() {
        return {
            type: '1',
            currentTime: '', // 当前时间
            timestamp: '', // 时间戳
            flexHeight: '', // 水印高度
            waterMarkerText: '', // 水印内容
            isWaterMarker: true, // 水印状态
            saleInfo: '', // 销售数据
            customerInfo: '', // 会员数据
            saleRankingInfo: '' // 销售排行
        };
    },
    created() {
        this.getCurrentTime();
    },
    onLoad() {
        _self = this;
        // 下个半小时刷新
        const getMinute = this.dayjs().minute();
        const surplusMinutes = getMinute > 30 ? (60 - getMinute) * 60000 : (30 - getMinute) * 60000;
        setTimeout(() => {
            this.getSetTimeout();
        }, surplusMinutes);
        this.asynchronousCall([this.getSale(), this.getCustomer(), this.getSaleRanking()]);
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
            // const getTime =
            //     dayjs().minute() > 30 ? dayjs().format('YYYY.MM.DD HH:30') : dayjs().format('YYYY.MM.DD HH:00');
            // this.currentTime = getTime;
            // this.timestamp = this.dayjs(getTime).valueOf();
            // return dayjs(getTime).valueOf(); // 最新时间戳
            return new Promise(resolve => {
                this.$request('getTime', {}).then(res => {
                    this.currentTime = res.data.updateTime.replace(/-/g, '.');
                    resolve();
                });
            });
        },
        getSale() {
            this.$request('getLiveSale', {}).then(res => {
                this.saleInfo = res.data;
            });
        },
        getCustomer() {
            this.$request('getLiveCustomer', {}).then(res => {
                this.customerInfo = res.data;
            });
        },
        getSaleRanking() {
            this.$request('getSaleRanking', {}).then(res => {
                this.saleRankingInfo = res.data;
            });
        },
        refresh() {
            this.getCurrentTime().then(() => {
                this.asynchronousCall([this.getSale(), this.getCustomer(), this.getSaleRanking()]);
            });
        },
        // 消息队列
        structureQueue(messageArr) {
            const promise = Promise.resolve();
            messageArr.reduce((total, item) => {
                return total.then(() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                        }, 0);
                    });
                });
            }, promise);
        },
        // 异步调用
        asynchronousCall(requestArr) {
            uni.showLoading();
            return new Promise(resolve => {
                Promise.all(requestArr).then(() => {
                    resolve();
                    uni.hideLoading();
                });
            });
        },
        // 添加全屏水印
        getWaterMarker() {
            const flexInfo = uni.createSelectorQuery().select('.content');
            const userName = this.$store.state.userInfo.nickName;
            const currentDate = this.dayjs().format('YYYY-MM-DD');
            flexInfo
                .boundingClientRect(data => {
                    this.structureQueue([
                        (this.flexHeight = data.height),
                        (this.waterMarkerText = userName + ' ' + currentDate),
                        (this.isWaterMarker = true)
                    ]);
                })
                .exec();
        }
    },
    watch: {
        saleRankingInfo() {
            this.$nextTick(() => {
                this.getWaterMarker();
            });
        }
    }
};
</script>
