<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
let _self;
let canvaColumn = null;
export default {
    data() {
        return {
            cWidth: uni.upx2px(750), // canvas宽度
            cHeight: uni.upx2px(450), // canvas高度
            canvasHeight: '',
            flexHeight: '', // 水印高度
            waterMarkerText: '', // 水印内容
            isWaterMarker: true, // 水印状态
            currentDate: '', // 默认时间
            startDate: '', // 结束日期时间戳
            endDate: '', // 开始日期时间戳
            showCalendar: false, // 日历组件
            getMaxDate: '', // 日历可选最大日期
            saleInfo: '', // 销售数据
            saleProvinceInfo: '', // 省份销售数据
            allSaleProvinceInfo: '' // 所有省份销售数据
        };
    },
    created() {
        this.getYesterday();
    },
    onLoad() {
        _self = this;
        this.asynchronousCall([this.getOfflineSale(), this.getProvinceSale()]);
    },
    methods: {
        // 获取T-1日期
        getYesterday() {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = this.dayjs(yesterday).format('YYYY.M.DD');
            this.currentDate = yesterdayDate + ' 至 ' + yesterdayDate;
            this.startDate = this.dayjs(yesterdayDate.replace(/\./g, '-')).valueOf();
            this.endDate = this.dayjs(yesterdayDate.replace(/\./g, '-')).valueOf();
        },
        // 显示日历
        selectCalendar(i) {
            this.showCalendar = true;
        },
        // 选择日期
        changeCalendar(e) {
            const getDateSlot =
                e.startYear +
                '.' +
                e.startMonth +
                '.' +
                e.startDay +
                ' - ' +
                e.endYear +
                '.' +
                e.endMonth +
                '.' +
                e.endDay;
            this.startDate = this.dayjs(e.startDate).valueOf();
            this.endDate = this.dayjs(e.endDate).valueOf();
            this.currentDate = getDateSlot;
            this.asynchronousCall([this.getOfflineSale(), this.getProvinceSale()]);
        },
        // 控制日期30天范围
        changeFirstDate(data) {
            const year = this.dayjs().year();
            const month = this.dayjs().month();
            const day = this.dayjs().date();
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const getLastDate = this.dayjs(this.dayjs(lastMonth).format('YYYY-M-DD')).valueOf(); // 上个月今天时间戳
            const getFirstDate = this.dayjs(data.firstDate).valueOf(); // 选中日期时间戳

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const newcurDate = this.dayjs(yesterday).format('YYYY-M-DD'); // 获取昨天日期
            const newMaxDate =
                data.firstMouth !== 12
                    ? data.firstYear + '-' + (data.firstMouth + 1) + '-' + data.firstDay
                    : data.firstYear + 1 + '-1-' + data.firstDay; // 选中的下个月今天
            this.getMaxDate = getLastDate > getFirstDate ? newMaxDate : newcurDate;
        },
        toMoreProvince() {
            this.jump('saleMore', this.allSaleProvinceInfo);
        },
        // 离线销售数据
        getOfflineSale() {
            return new Promise(resolve => {
                this.$request('getOfflineSale', {
                    startTime: this.startDate,
                    endTime: this.endDate
                }).then(res => {
                    this.saleInfo = res.data;
                    const column = { categories: [], series: [] };
                    const seriesStr = {
                        name: '数量',
                        data: []
                    };
                    for (const i in res.data.orderAnalysisVos) {
                        column.categories.push(res.data.orderAnalysisVos[i].title);
                        seriesStr.data.push(res.data.orderAnalysisVos[i].orderNumber);
                    }
                    column.series.push(seriesStr);
                    _self.showBarChart('showBarChart', column);
                    resolve();
                });
            });
        },
        // 离线省份销售数据
        getProvinceSale() {
            return new Promise(resolve => {
                this.$request('getProvinceSale', {
                    startTime: this.startDate,
                    endTime: this.endDate
                }).then(res => {
                    this.allSaleProvinceInfo = res.data;
                    this.saleProvinceInfo = res.data.slice(0, 3);
                    resolve();
                });
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
                    this.getWaterMarker();
                    uni.hideLoading();
                });
            });
        },
        // 订单柱状图
        showBarChart(canvasId, chartData) {
            canvaColumn = new UCharts({
                $this: _self,
                canvasId: canvasId,
                padding: [20, 20, 20, 20],
                type: 'column',
                legend: { show: false },
                fontSize: 11,
                background: '#FFFFFF',
                pixelRatio: 1,
                animation: true,
                rotate: false,
                categories: chartData.categories,
                series: chartData.series,
                xAxis: {
                    type: 'grid',
                    gridColor: '#CCCCCC',
                    gridType: 'dash',
                    dashLength: 8,
                    disableGrid: true,
                    calibration: false
                },
                yAxis: {
                    gridType: 'dash',
                    gridColor: '#CCCCCC',
                    dashLength: 8,
                    splitNumber: 5,
                    disableGrid: true,
                    calibration: false
                    // format: val => {
                    //     return val.toFixed(0);
                    // }
                },
                dataLabel: true,
                width: _self.cWidth - 30,
                height: _self.cHeight,
                extra: {
                    column: {
                        type: 'group',
                        width: 30,
                        meter: {
                            border: 1,
                            fillColor: '#E5FDC3'
                        }
                    }
                }
            });
        },
        // 柱状图tools
        touchColumn(e) {
            canvaColumn.showToolTip(e, {
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        moveColumn(e) {
            this.touchColumn(e);
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
        saleInfo() {
            this.$nextTick(() => {
                const showPieChart = uni.createSelectorQuery().select('.showBarChart');
                showPieChart
                    .boundingClientRect(data => {
                        this.canvasHeight = data.height;
                    })
                    .exec();
            });
        }
    }
};
</script>
