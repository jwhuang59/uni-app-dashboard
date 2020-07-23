<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
import dayjs from 'dayjs';
var _self;
var canvaColumn = null;
var canvaArea = null;
export default {
    data() {
        return {
            cWidth2: '', // 横屏图表
            cHeight2: '', // 横屏图表
            lastMonth: [], // 前30天数组
            timeSlot: [], // 24小时时间段
            defaultTime: '',
            current: 0,
            reportText: ['订单分布', '客户分布', '转化分析', '活动分析']
        };
    },
    onLoad() {
        _self = this;
        this.cWidth2 = uni.upx2px(750);
        console.log(uni.upx2px(750));
        this.cHeight2 = uni.upx2px(300);
        this.getServerData();
        this.getDate();
        this.getRequest();
    },
    methods: {
        getServerData() {
            uni.request({
                url: 'https://www.UCharts.cn/data.json',
                data: {},
                success: function (res) {
                    console.log(res.data.data);
                    const showBarChart = { categories: [], series: [] };
                    showBarChart.categories = [
                        '线上订单',
                        '线上订单',
                        '线上订单',
                        '线上订单',
                        '线上订单',
                        '线上订单'
                    ];
                    const arr = [];
                    arr.push(res.data.data.ColumnB.series[1]);
                    showBarChart.series = arr;

                    const showCurveChart = { categories: [], series: [] };
                    showCurveChart.categories = res.data.data.Area.categories;
                    const arr0 = [];
                    arr0.push(res.data.data.Area.series[0]);
                    showCurveChart.series = arr0;
                    _self.showBarChart('showBarChart', showBarChart);
                    _self.showCurveChart('showCurveChart', showCurveChart);
                },
                fail: () => {
                    _self.tips = '网络错误，小程序端请检查合法域名';
                }
            });
        },
        // 横屏柱状图
        showBarChart(canvasId, chartData) {
            canvaColumn = new UCharts({
                $this: _self,
                canvasId: canvasId,
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
                    disableGrid: true
                },
                yAxis: {},
                dataLabel: true,
                width: _self.cWidth2,
                height: _self.cHeight2,
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
        // 曲线图
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
                    min: 10,
                    max: 180,
                    disableGrid: true,
                    calibration: false
                },
                width: _self.cWidth2,
                height: 150,
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
        // 柱状图tools
        touchColumn(e) {
            canvaColumn.showToolTip(e, {
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
        // 获取时间段
        getDate() {
            const timeSlot = [];
            const lastMonth = [];
            let getTime;
            for (let i = 0; i < 24; i++) {
                if (i === 23) {
                    getTime = '23:00 - 0:00';
                } else {
                    getTime = i + ':00 - ' + Number(i + 1) + ':00';
                }
                timeSlot.push(getTime);
            }
            for (var i = 0; i < 30; i++) {
                lastMonth.unshift(
                    dayjs(
                        new Date(
                            new Date().setDate(new Date().getDate() - i)
                        ).toLocaleDateString()
                    ).format('MM月DD日')
                );
            }
            this.lastMonth = lastMonth.reverse();
            this.timeSlot = timeSlot;
            this.defaultTime = lastMonth[0] + timeSlot[0];
        },
        // 切换时间段
        bindChange: function (e) {
            const val = e.detail.value;
            this.defaultTime = this.lastMonth[val[0]] + this.timeSlot[val[1]];
        },
        changeReport(e) {
            this.current = e.detail.current;
        },
        switchTab(e) {
            this.current = e.currentTarget.dataset.id;
        },
        getRequest() {
            // new Promise((reslove,reject) => {
            //    setTimeout(() => {
            //        reslove('hello')
            //    },2000)
            // }).then((res) => {
            //     console.log(res)
            //     return new Promise(function(resolve){
            //         setTimeout(function(){
            //             resolve('world');
            //         },1000)
            //     })
            // }).then((res) => {
            //     console.log(res)
            // })
        },
        // 消息队列
        structureQueue(arr) {
            const promise = Promise.resolve();
            arr.reduce(function (totel, item) {
                return totel.then(() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            console.log('reduce', item);
                            resolve();
                        }, 3000);
                    });
                });
            }, promise);
        },
        func0(value) {
            return new Promise(resolve => {
                resolve();
            });
        },
        func1(value) {
            return new Promise(resolve => {
                resolve();
            });
        }
    },
    computed: {
        // "msg":{
        //     set(value){
        //         this.func(value)
        //     },
        //     get(){
        //         return this.defaultTime
        //     }
        // }
        // msg(){
        //     return this.defaultTime
        // }
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.func0()
            .then(() => {
                return this.func1();
            })
            .then(() => {
                console.log('结束');
            });

        // this.structureQueue([this.func0(),this.func1("123"),this.func2()])
    }
};
</script>
