<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
let _self;
let canvaPie = null;
let canvaRing = null;
export default {
    data() {
        return {
            cWidth: uni.upx2px(450), // 屏幕宽度
            cHeight: uni.upx2px(450), // canvas高度
            pieSeries: '', // 注册渠道数据
            ringSeries: '' // 会员消费数据
        };
    },
    onLoad() {
        _self = this;
        this.getServerData();
    },
    methods: {
        getNotes(){
            
        },
        getServerData() {
            uni.request({
                url: 'https://www.ucharts.cn/data.json',
                data: {},
                success: function (res) {
                    const Ring = { series: [] };
                    Ring.series = res.data.data.Ring.series;
                    _self.showRingChart('showRingChart', Ring);
                    _self.ringSeries = Ring.series;
                    const Pie = { series: [] };
                    Pie.series = res.data.data.Pie.series;
                    _self.pieSeries = Pie.series;
                    _self.showPieChart('showPieChart', Pie);
                },
                fail: () => {
                    _self.tips = '网络错误，小程序端请检查合法域名';
                }
            });
        },
        showPieChart(canvasId, chartData) {
            canvaPie = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'pie',
                fontSize: 12,
                legend: {
                    show: false
                },
                background: '#FFFFFF',
                series: chartData.series,
                animation: true,
                width: _self.cWidth - 50,
                height: _self.cHeight - 50,
                disablePieStroke: true,
                dataLabel: false,
                extra: {
                    pie: {
                        lableWidth: 0,
                        activeRadius: 10
                    }
                }
            });
        },
        showRingChart(canvasId, chartData) {
            canvaRing = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'ring',
                fontSize: 11,
                title: {
                    name: '70%',
                    color: '#7cb5ec',
                    fontSize: 20
                },
                extra: {
                    pie: {
                        ringWidth: 25,
                        labelWidth: 0
                    }
                },
                legend: {
                    show: false
                },
                background: '#FFFFFF',
                series: chartData.series,
                animation: true,
                width: _self.cWidth - 50,
                height: _self.cHeight - 50,
                disablePieStroke: true,
                dataLabel: false
            });
        },
        // 饼状图tools
        touchPie(e) {
            canvaPie.showToolTip(e, {
                format: function (item) {
                    const proportion = (item.data / 100) * 100 + '%';
                    return item.name + ':' + proportion;
                }
            });
        },
        movePie(e) {
            this.touchPie(e);
        },
        // 圆环图tools
        touchRing(e) {
            canvaRing.showToolTip(e, {
                format: function (item) {
                    const proportion = (item.data / 100) * 100 + '%';
                    return item.name + ':' + proportion;
                }
            });
        },
        moveRing(e) {
            this.touchRing(e);
        }
    }
};
</script>
