<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import UCharts from '../../libs/u-charts';
let _self;
let canvaMix = null;
export default {
    data() {
        return {
            cWidth: uni.upx2px(750), // 屏幕宽度
            cHeight: uni.upx2px(450) // canvas高度
        };
    },
    onLoad() {
        _self = this;
        this.getServerData();
    },
    methods: {
        getServerData() {
            uni.request({
                url: 'https://www.ucharts.cn/data.json',
                data: {},
                success: function (res) {
                    console.log(res.data.data);
                    const Mix = { categories: [], series: [] };
                    Mix.categories = res.data.data.Mix.categories;

                    Mix.series = res.data.data.Mix.series;
                    Mix.series[3].disableLegend = false;
                    Mix.series = Mix.series.splice(3, 2);
                    Mix.series[0].index = 0;
                    Mix.series[1].index = 1;
                    console.log(Mix.series);
                    _self.showMix('canvasMix', Mix);
                },
                fail: () => {
                    _self.tips = '网络错误，小程序端请检查合法域名';
                }
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
        }
    }
};
</script>
