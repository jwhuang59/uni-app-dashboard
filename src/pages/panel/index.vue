<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
import comWaterMarker from '@/components/com-watermarker';
import dayjs from 'dayjs';
let _self;
let canvaColumn = null;
let canvaColumn0 = null;
let canvaArea = null;
let canvaPie = null;
export default {
    components: {
        comWaterMarker
    },
    data() {
        return {
            cWidth: uni.upx2px(750), // 屏幕宽度
            cHeight: uni.upx2px(500), // 屏幕高度
            pattern: [
                { id: 1, name: '时模式' },
                { id: 2, name: '日模式' }
            ],
            timeType: 1, // 时日模式下标
            lastMonth: [], // 前30天日期数组
            startTimePoint: [], // 开始时间点数组
            endTimePoint: [], // 结束时间点数组
            currentTime: '', // 当前时间段
            currentDate: '', // 当前日期段
            current: 0, // 下标切换运营报告
            reportText: ['订单分布', '客户分布', '转化分析', '活动分析'],
            showCalendar: false, // 日历组件
            showTimeSlot: false, // 时间段组件
            getStartTime: '', // 开始时间戳
            getEndTime: '', // 结束时间戳
            dateIndex: Number, // 日历下标
            getMaxDate: '', // 日历可选最大日期
            salesCountInfo: '', // 总销售数据
            orderInfo: '', // 总订单数据
            orderAnalysis: [], // 订单图表
            memberInfo: [], // 客户统计数据
            memberRetainedInfo: '', // 客户留存率
            conversionInfo: '', // 转化数据
            conversionChartAnalysis: [], // 转化表格数据
            activityList: [], // 活动标题列表
            activityMenu: [], // 活动详情列表
            activityId: 1, // 默认活动id
            activitySalesInfo: '', // 活动销售数据
            activitySalesRanking: '', // 活动销售榜首
            activityChartAnalysis: '', // 活动销售曲线图
            comparisonSalesInfo: '', // 定向对比数据
            contrastDate: [], // 活动对比日期
            beforeDate: '', // 比较日期时间戳
            afterDate: '', // 被比较日期时间戳
            flexHeight: '', // 水印高度
            waterMarkerText: '' // 水印内容
        };
    },
    created() {
        this.getCurrentTime();
        this.getDate();
        this.waterMarkerText = '锅圈数坊';
    },
    onLoad() {
        _self = this;
        this.getPromiseAsyn(this.current);
        setTimeout(() => {
            this.getActivityList();
            this.getActivityAnalysis();
        }, 3000);

        // 下个整点刷新
        const nowTime = new Date();
        const surplusMinutes = (60 - nowTime.getMinutes()) * 60000;
        setTimeout(() => {
            _self.getSetTimeout();
        }, surplusMinutes);
    },
    mounted() {
        const flexInfo = uni.createSelectorQuery().select('.flex');
        flexInfo
            .boundingClientRect(data => {
                _self.flexHeight = data.height;
            })
            .exec();
    },
    methods: {
        // 整点刷新
        getSetTimeout() {
            this.getPromiseAsyn(this.current);
            setTimeout(() => {
                _self.getSetTimeout();
            }, 3600 * 1000);
        },
        getFunc(val) {
            console.log(val);
        },
        // 获取当前时间，日期，开始时间，结束时间
        getCurrentTime() {
            const getDate = dayjs().format('YYYY-MM-DD 00:00');
            const timePoint = dayjs().format('HH:mm');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            this.timeType = 1;
            this.getMaxDate = dayjs().format('YYYY-MM-DD'); // 日历可选最大日期
            this.currentTime = getDate + '-' + timePoint; // 显示当前时间段
            this.currentDate = dayjs(yesterday).format('YYYY年MM月DD日') + '-' + dayjs().format('YYYY年MM月DD日'); // 显示当前日期段
            this.getStartTime = dayjs(getDate).valueOf(); // 开始时间戳
            this.getEndTime = dayjs().valueOf(); // 结束时间戳
        },
        // 获取时间，日期数组
        getDate() {
            const timePoint = [];
            const lastMonth = [];
            for (let i = 0; i < 25; i++) {
                timePoint.push(i + ':00');
            }
            for (let i = 0; i < 30; i++) {
                lastMonth.unshift(
                    dayjs(new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString()).format(
                        'YYYY-MM-DD'
                    )
                );
            }
            this.lastMonth = lastMonth.reverse();
            this.startTimePoint = timePoint;
            this.endTimePoint = timePoint.slice(1);
        },

        // 日模式显示日历组件
        selectDatePattern(value) {
            this.dateIndex = value;
            this.showCalendar = true;
        },
        // 切换运营报告
        switchTab(e) {
            this.getTest = ['1', '2'];
            const newCurrent = e.currentTarget.dataset.id;
            this.current = newCurrent;
            // if (this.current !== newCurrent) {
            //     this.getPromiseAsyn(newCurrent);
            // }
        },
        // 切换时日模式
        radioChange(e) {
            this.timeType = e.detail.value;
        },
        // 控制日期30天范围
        changeFirstDate(data) {
            const year = dayjs().year();
            const month = dayjs().month();
            const day = dayjs().date();
            let lastMonth = '';
            if (month !== 0) {
                lastMonth = month;
            } else {
                lastMonth = 12;
            }

            const getLastDate = dayjs(year + '-' + lastMonth + '-' + day).valueOf();
            const getFirstDate = dayjs(data.firstDate).valueOf();
            const newMaxDate = data.firstYear + '-' + (data.firstMouth + 1) + '-' + data.firstDay;
            const newcurDate = dayjs().format('YYYY-MM-DD');
            if (getLastDate > getFirstDate) {
                this.getMaxDate = newMaxDate;
            } else {
                this.getMaxDate = newcurDate;
            }
        },
        // 日模式选择日期
        changeCalendar(e) {
            this.getStartTime = dayjs(e.startDate + ' 00:00').valueOf(); // 开始时间戳
            this.getEndTime = dayjs(e.endDate + ' 00:00').valueOf(); // 结束时间戳

            if (this.dateIndex === 1) {
                this.currentDate =
                    e.startYear +
                    '年' +
                    e.startMonth +
                    '月' +
                    e.startDay +
                    '日 - ' +
                    e.endYear +
                    '年' +
                    e.endMonth +
                    '月' +
                    e.endDay +
                    '日';
                this.getPromiseAsyn(this.current);
            } else {
                const activityDateArr = [];
                activityDateArr.push(e.startDate, e.endDate);
                this.contrastDate = activityDateArr;
                this.beforeDate = dayjs(e.startDate).valueOf();
                this.afterDate = dayjs(e.endDate).valueOf();
                this.activityComparison();
            }
        },
        // 选中一列值触发
        columnchange(e) {
            const newEndTimePoint = [];
            const val = e.detail.value;
            const col = e.detail.column;
            if (col === 1) {
                for (let i = val; i < 24; i++) {
                    newEndTimePoint.push(Number(i + 1) + ':00');
                }
                this.endTimePoint = newEndTimePoint;
            }
        },

        // 时模式选择时间段
        timeSlotChange: function (e) {
            this.showTimeSlot = false;
            const val = e.detail.value;
            const lastMonth = this.lastMonth[val[0]];
            const startTimePoint = this.startTimePoint[val[1]];
            const endTimePoint = this.endTimePoint[val[2]];

            this.currentTime = lastMonth + ' ' + startTimePoint + '-' + endTimePoint; // 显示时间段
            this.getStartTime = dayjs((lastMonth + ' ' + startTimePoint).toString()).valueOf(); // 开始时间戳
            this.getEndTime = dayjs((lastMonth + ' ' + endTimePoint).toString()).valueOf(); // 结束时间戳

            this.getPromiseAsyn(this.current);
        },
        selectTimeSlot() {
            this.showTimeSlot = true;
        },
        cancelTimeSlot() {
            this.showTimeSlot = false;
        },
        // 选择活动
        selectActivity(e) {
            uni.showLoading({
                title: '加载中'
            });
            const val = e.detail.value;
            this.activityId = this.activityMenu[val].activityId;
            this.getActivityAnalysis();
        },
        // 重置页面数据
        refreshData() {
            // this.jump('saleMore', this.orderAnalysis);
            this.getCurrentTime();
            this.getPromiseAsyn(this.current);
        },
        // 总销售额
        getSalesVolume() {
            uni.showLoading({
                title: '加载中'
            });
            return new Promise(resolve => {
                this.$request('salesStatistics', {
                    startTime: this.getStartTime,
                    endTime: this.getEndTime,
                    type: this.timeType
                }).then(res => {
                    this.salesCountInfo = res.data;

                    resolve(true);
                });
            });
        },
        // 运营报告订单分布
        getOrderDistribution() {
            this.structureQueue([this.getOrderStatistics(), this.getOrderAnalysis()]);
        },
        // 总订单数量
        getOrderStatistics() {
            return new Promise(resolve => {
                this.$request('orderStatistics', {
                    startTime: this.getStartTime,
                    endTime: this.getEndTime,
                    type: this.timeType
                }).then(res => {
                    this.orderInfo = res.data;
                    res.data.orderChartModel.categories.pop();
                    _self.showBarChart('showBarChart', res.data.orderChartModel);
                    resolve();
                });
            });
        },
        // 订单表格
        getOrderAnalysis() {
            return new Promise(resolve => {
                this.$request('orderAnalysis', {
                    startTime: this.getStartTime,
                    endTime: this.getEndTime,
                    type: this.timeType
                }).then(res => {
                    this.orderAnalysis = res.data;
                    resolve();
                });
            });
        },
        // 运营报告客户分布
        getCustomerDistribution() {
            this.structureQueue([this.getMemberAnalysis(), this.getMemberRetained()]);
        },
        // 客户数据统计
        getMemberAnalysis() {
            return new Promise(resolve => {
                this.$request('memberAnalysis', {
                    startTime: this.getStartTime,
                    endTime: this.getEndTime,
                    type: this.timeType
                }).then(res => {
                    this.memberInfo = res.data;
                    const showPieChart = {};
                    showPieChart.series = res.data.memberDistributions;
                    _self.showPieChart('showPieChart', showPieChart);
                    resolve();
                });
            });
        },
        // 客户留存率
        getMemberRetained() {
            return new Promise(resolve => {
                this.$request('memberRetained', {
                    startTime: this.getStartTime,
                    endTime: this.getEndTime,
                    type: this.timeType
                }).then(res => {
                    this.memberRetainedInfo = res.data;
                    resolve();
                });
            });
        },
        // 运营报告转化分析
        getConversionAnalysis() {
            this.$request('conversionStatistics', {
                startTime: this.getStartTime,
                endTime: this.getEndTime,
                type: this.timeType
            }).then(res => {
                this.conversionInfo = res.data;
                _self.showBarChart0('showBarChart0', res.data.conversionChartAnalysis);
            });
        },
        // 运营报告活动分析
        getActivityAnalysis() {
            this.AsynchronousCall([this.getActivityGraph(), this.getActivityInfo(), this.getActivityRanking()]).then(
                () => {
                    uni.hideLoading();
                }
            );
        },
        // 活动列表
        getActivityList() {
            this.$request('activityList', {}).then(res => {
                const activityArr = [];
                for (let i = 0; i < res.data.length; i++) {
                    activityArr.push(res.data[i].activityTitle);
                }
                this.activityList = activityArr;
                this.activityMenu = res.data;
            });
        },
        // 活动销售曲线图
        getActivityGraph() {
            this.$request('queryActivityGraph', {
                activityId: this.activityId
            }).then(res => {
                this.activityChartAnalysis = res.data;
                _self.showCurveChart('showCurveChart', res.data);
            });
        },
        // 活动销售数据
        getActivityInfo() {
            this.$request('activityAnalysis', {
                activityId: this.activityId
            }).then(res => {
                this.activitySalesInfo = res.data;
            });
        },
        // 地区销售榜首
        getActivityRanking() {
            this.$request('activityRanking', {
                activityId: this.activityId
            }).then(res => {
                this.activitySalesRanking = res.data;
            });
        },
        // 活动定向对比
        activityComparison() {
            this.$request('activityDirectionalContrast', {
                startTime: this.beforeDate,
                endTime: this.afterDate
            }).then(res => {
                this.comparisonSalesInfo = res.data;
            });
        },
        // 消息队列
        structureQueue(messageArr) {
            const promise = Promise.resolve();
            return messageArr.reduce((total, item) => {
                return total.then(res => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                        }, 0);
                    });
                });
            }, promise);
        },
        // 异步调用
        AsynchronousCall(requestArr) {
            return new Promise(resolve => {
                Promise.all(requestArr).then(() => {
                    uni.hideLoading();
                    resolve();
                });
            });
        },
        // 异步请求流程
        getPromiseAsyn(current) {
            this.getSalesVolume().then(res => {
                if (res) {
                    switch (current) {
                        case 0:
                            this.AsynchronousCall([this.getOrderStatistics(), this.getOrderAnalysis()]).then(() => {
                                this.structureQueue([this.getCustomerDistribution(), this.getConversionAnalysis()]);
                            });

                            break;
                        case 1:
                            this.AsynchronousCall([this.getMemberAnalysis(), this.getMemberRetained()]).then(() => {
                                this.structureQueue([this.getOrderDistribution(), this.getConversionAnalysis()]);
                            });

                            break;
                        case 2:
                            this.AsynchronousCall([this.getConversionAnalysis()]).then(() => {
                                this.structureQueue([this.getOrderDistribution(), this.getCustomerDistribution()]);
                            });

                            break;
                        case 3:
                            this.AsynchronousCall([
                                this.getOrderDistribution(),
                                this.getCustomerDistribution(),
                                this.getConversionAnalysis()
                            ]);
                            break;
                    }
                }
            });
        },
        // 订单柱状图
        showBarChart(canvasId, chartData) {
            canvaColumn = new UCharts({
                $this: _self,
                canvasId: canvasId,
                padding: [20, 20, 20, 20],
                type: 'column',
                legend: { show: true },
                fontSize: 11,
                background: '#FFFFFF',
                pixelRatio: 1,
                animation: true,
                rotate: false,
                // #ifdef MP-ALIPAY || MP-BAIDU
                rotateLock: true, // 百度及支付宝需要锁定旋转
                // #endif
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
                    calibration: false,
                    format: val => {
                        return val.toFixed(1);
                    }
                },
                dataLabel: true,
                width: _self.cWidth - 30,
                height: _self.cHeight,
                extra: {
                    column: {
                        type: 'group',
                        width: 30,
                        meter: {
                            // 这个是外层边框的宽度
                            border: 1,
                            // 这个是内部填充颜色
                            fillColor: '#E5FDC3'
                        }
                    }
                }
            });
        },
        // 活动曲线图
        showCurveChart(canvasId, chartData) {
            canvaArea = new UCharts({
                $this: this,
                canvasId: canvasId,
                type: 'area',
                fontSize: 11,
                legend: { show: true },
                dataLabel: false,
                dataPointShape: false,
                background: '#FFFFFF',
                pixelRatio: 1,
                categories: chartData.categories,
                series: chartData.series,
                animation: true,
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
                    calibration: false,
                    format: val => {
                        return val.toFixed(0);
                    }
                },
                width: _self.cWidth - 30,
                height: _self.cHeight,
                extra: {
                    area: {
                        type: 'curve',
                        opacity: 0,
                        addLine: true,
                        width: 2
                    }
                }
            });
        },
        // 转化柱状图
        showBarChart0(canvasId, chartData) {
            canvaColumn0 = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'column',
                legend: { show: true },
                padding: [20, 20, 20, 20],
                fontSize: 11,
                background: '#FFFFFF',
                pixelRatio: 1,
                animation: true,
                rotate: false,
                // #ifdef MP-ALIPAY || MP-BAIDU
                rotateLock: true, // 百度及支付宝需要锁定旋转
                // #endif
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
                    calibration: false,
                    format: val => {
                        return val.toFixed(0);
                    }
                },
                dataLabel: true,
                width: _self.cWidth - 30,
                height: _self.cHeight,
                splitNumber: 6,
                extra: {
                    column: {
                        type: 'group',
                        width: 30,
                        meter: {
                            // 这个是外层边框的宽度
                            border: 1,
                            // 这个是内部填充颜色
                            fillColor: '#E5FDC3'
                        }
                    }
                }
            });
        },
        // 客户饼状图
        showPieChart(canvasId, chartData) {
            canvaPie = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'pie',
                fontSize: 12,
                legend: {
                    show: true,
                    lineHeight: 20
                },
                background: '#FFFFFF',
                series: chartData.series,
                animation: true,
                width: _self.cWidth - 30,
                height: _self.cHeight,
                dataLabel: true,
                extra: {
                    pie: {
                        lableWidth: 15,
                        ringWidth: 100,
                        borderWidth: 5,
                        activeRadius: 20
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
        // 柱状图tools
        touchColumn0(e) {
            canvaColumn0.showToolTip(e, {
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        // 曲线图tools
        touchArea(e) {
            canvaArea.showToolTip(e, {
                format: function (item, category) {
                    return category + ' ' + item.name + ':' + item.data;
                }
            });
        },
        // 饼状图tools
        touchPie(e) {
            console.log(canvaPie);
            canvaPie.showToolTip(e, {
                format: function (item) {
                    return item.name + ':' + item.data;
                }
            });
        }
    },
    watch: {},
    // 下拉刷新
    onPullDownRefresh() {}
};
</script>
