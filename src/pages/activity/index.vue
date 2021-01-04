<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
let _self;
let canvaMix = null;
export default {
    data() {
        return {
            cWidth: uni.upx2px(750), // canvas宽度
            cHeight: uni.upx2px(450), // canvas高度
            flexHeight: '', // 水印高度
            waterMarkerText: '', // 水印内容
            isWaterMarker: false, // 水印状态
            currentStartDate: '', // 对比开始时间
            currentEndDate: '', // 对比结束时间
            startDate: '', // 开始日期时间戳
            endDate: '', // 结束日期时间戳
            showCalendar: false, // 日历组件
            getMaxDate: '', // 日历可选最大日期
            activitySub: 0, // 活动列表下标
            activityTitleList: [], // 活动标题列表
            activityMenu: [], // 活动详情列表
            activityAnalysis: '', // 活动分析
            activityRankingList: '', // 活动排行
            activityGraph: '', // 活动图表
            activityComparison: '', // 活动定向对比
            indexVal: 0, // 指标名
            indexMenu: ['总销售额', '总订单数', '店均订单'] // 指标列表
        };
    },
    created() {
        this.getYesterday();
    },
    onLoad() {
        _self = this;
        this.asynchronousCall([this.getActivityList()]).then(() => {
            this.structureQueue([
                this.getActivityAnalysis(),
                this.getActivityRanking(),
                this.getActivityGraph(),
                this.directionalContrast()
            ]);
        });
    },
    methods: {
        // 获取T-1日期
        getYesterday() {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = this.dayjs(yesterday).format('YYYY.M.DD');
            this.currentEndDate = yesterdayDate;
            this.endDate = this.dayjs(yesterdayDate.replace(/\./g, '-')).valueOf();
        },
        // 显示日历
        selectCalendar() {
            this.showCalendar = true;
        },
        // 选择日期
        changeCalendar(e) {
            this.startDate = this.dayjs(e.startDate).valueOf();
            this.endDate = this.dayjs(e.endDate).valueOf();
            this.currentStartDate = e.startYear + '.' + e.startMonth + '.' + e.startDay;
            this.currentEndDate = e.endYear + '.' + e.endMonth + '.' + e.endDay;
            this.directionalContrast();
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
        // 选择活动
        selectActivity(e) {
            this.activitySub = e.detail.value;
            this.asynchronousCall([this.getActivityList()]).then(() => {
                this.structureQueue([this.getActivityAnalysis(), this.getActivityGraph()]);
            });
        },
        // 选择指标
        selectIndex(e) {
            this.indexVal = Number(e.detail.value);
            this.getActivityRanking();
        },
        // 活动列表
        getActivityList() {
            return new Promise(resolve => {
                this.$request('activityList', {}).then(res => {
                    const activityArr = [];
                    for (let i = 0; i < res.data.length; i++) {
                        activityArr.push(res.data[i].activityTitle);
                    }
                    this.activityTitleList = activityArr;
                    this.activityMenu = res.data;
                    this.currentStartDate = res.data[0].startTime;
                    this.startDate = this.dayjs(res.data[0].startTime.replace(/\./g, '-')).valueOf();
                    resolve();
                });
            });
        },
        // 活动分析数据
        getActivityAnalysis() {
            this.$request('activityAnalysis', {
                activityId: this.activityMenu[this.activitySub].activityId
            }).then(res => {
                this.activityAnalysis = res.data;
            });
        },
        // 活动排行
        getActivityRanking() {
            this.$request('activityRanking', {
                activityId: this.activityMenu[this.activitySub].activityId,
                type: this.indexVal + 1
            }).then(res => {
                this.activityRankingList = res.data;
            });
        },
        // 活动图表
        getActivityGraph() {
            this.$request('activityGraph', {
                activityId: this.activityMenu[this.activitySub].activityId
            }).then(res => {
                const activityGraph = res.data;
                for (const i in activityGraph.series) {
                    activityGraph.series[i].type = 'line';
                    activityGraph.series[i].index = i;
                }
                activityGraph.series[0].style = 'curve';
                _self.showMix('canvasMix', activityGraph);
            });
        },
        // 活动定向对比
        directionalContrast() {
            this.$request('directionalContrast', {
                startTime: this.startDate,
                endTime: this.endDate
            }).then(res => {
                this.activityComparison = res.data;
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
        showMix(canvasId, chartData) {
            canvaMix = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'mix',
                fontSize: 11,
                padding: [20, 10, 20, 10],
                legend: { show: true },
                background: '#FFFFFF',
                categories: chartData.categories,
                series: chartData.series,
                animation: true,
                xAxis: {
                    disableGrid: false,
                    type: 'grid',
                    gridType: 'dash',
                    itemCount: 6
                },
                yAxis: {
                    data: [
                        {
                            position: 'left'
                        },
                        {
                            position: 'right'
                        }
                    ],
                    format: val => {
                        return val.toFixed(0) + '个';
                    },
                    gridType: 'dash',
                    splitNumber: 5
                },
                width: _self.cWidth - 30,
                height: _self.cHeight,
                dataLabel: true,
                dataPointShape: true,
                extra: {
                    tooltip: {
                        bgColor: '#000000',
                        bgOpacity: 0.7,
                        gridType: 'dash',
                        dashLength: 8,
                        gridColor: '#1890ff',
                        fontColor: '#FFFFFF',
                        yAxisLabel: true,
                        labelBgColor: '#DFE8FF',
                        labelBgOpacity: 0.95,
                        labelAlign: 'left',
                        labelFontColor: '#666666'
                    }
                }
            });
        },
        touchMix(e) {
            canvaMix.showToolTip(e, {
                format: function (item, category) {
                    return item.name + ':' + item.data;
                }
            });
        },
        moveMix(e) {
            this.touchMix(e);
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
        activityComparison() {
            this.$nextTick(() => {
                this.getWaterMarker();
            });
        }
    }
};
</script>
