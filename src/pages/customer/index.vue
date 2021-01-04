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
            cWidth: uni.upx2px(450), // canvas宽度
            cHeight: uni.upx2px(450), // canvas高度
            canvasHeight: '',
            flexHeight: '', // 水印高度
            waterMarkerText: '', // 水印内容
            isWaterMarker: false, // 水印状态
            currentDate: '', // 默认日期
            startDate: '', // 结束日期时间戳
            endDate: '', // 开始日期时间戳
            showCalendar: false, // 日历组件
            getMaxDate: '', // 日历可选最大日期
            pieSeries: '', // 注册渠道数据
            ringSeries: '', // 会员消费数据
            memberRetainedInfo: '', // 会员留存复购
            memberAnalysisInfo: '', // 会员数据分析
            // canvasImg: '', // canvas饼状图
            // canvasImg0: '', // canvas环形图
            showCanvas: true, // 显示
            isNotes: false,
            notesText: '这是一条注释',
            noteWidth: '',
            noteTop: '',
            noteLeft: ''
        };
    },
    created() {
        this.getYesterday();
    },
    onLoad() {
        _self = this;
        this.asynchronousCall([this.getMemberRetained(), this.getMemberAnalysis()]);
    },
    methods: {
        // 触摸提示注释
        showNotes(e) {
            const cWidth = uni.getSystemInfoSync().screenWidth;
            this.notesText = e.currentTarget.dataset.text;
            this.noteTop = e.touches[0].pageY;
            this.isNotes = true;
            if (e.touches[0].pageX < cWidth / 2) {
                this.noteWidth = cWidth - e.touches[0].pageX - 30;
                this.noteLeft = e.touches[0].pageX + 15;
            } else {
                this.noteWidth = e.touches[0].pageX - 30;
                this.noteLeft = 15;
            }
        },
        hideNotes() {
            this.isNotes = false;
        },
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
            this.asynchronousCall([this.getMemberRetained(), this.getMemberAnalysis()]);
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
        // 客户留存复购
        getMemberRetained() {
            return new Promise(resolve => {
                this.$request('memberRetention', {
                    startTime: this.startDate,
                    endTime: this.endDate
                }).then(res => {
                    this.memberRetainedInfo = res.data;
                    resolve();
                });
            });
        },
        // 客户分析
        getMemberAnalysis() {
            this.$request('memberAnalysis', {
                startTime: this.startDate,
                endTime: this.endDate
            }).then(res => {
                this.memberAnalysisInfo = res.data;
                const memberAnalysisRing = res.data.memberConsumptionChart;
                const memberAnalysisPie = res.data.memberDistributions;
                const ringGraph = { series: '' };
                const pieGraph = { series: '' };
                for (const i in memberAnalysisPie) {
                    memberAnalysisPie[i].newData = memberAnalysisPie[i].data;
                    memberAnalysisPie[i].data = Number(memberAnalysisPie[i].proportion.replace('%', ''));
                }
                for (const i in memberAnalysisRing) {
                    memberAnalysisRing[i].data = Number(memberAnalysisRing[i].salesProportion.replace('%', ''));
                    memberAnalysisRing[i].name = memberAnalysisRing[i].membershipGrade;
                }
                ringGraph.series = memberAnalysisRing;
                pieGraph.series = memberAnalysisPie;
                this.showPieChart('showPieChart', pieGraph);
                this.showRingChart('showRingChart', ringGraph);

                // canvaRing.addEventListener('renderComplete', () => {
                //     uni.canvasToTempFilePath({
                //         x: 0,
                //         y: 0,
                //         width: _self.cWidth,
                //         height: _self.cHeight,
                //         destWidth: 100,
                //         destHeight: 100,
                //         canvasId: 'showRingChart',
                //         success(res) {
                //             _self.canvasImg = res.tempFilePath;
                //         }
                //     });
                // });
                // canvaPie.addEventListener('renderComplete', () => {
                //     uni.canvasToTempFilePath({
                //         x: 0,
                //         y: 0,
                //         width: _self.cWidth,
                //         height: _self.cHeight,
                //         destWidth: 100,
                //         destHeight: 100,
                //         canvasId: 'showPieChart',
                //         success(res) {
                //             _self.canvasImg0 = res.tempFilePath;
                //             _self.showCanvas = false;
                //         }
                //     });
                // });
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
        // 注册渠道
        showPieChart(canvasId, chartData) {
            canvaPie = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'ring',
                fontSize: 12,
                legend: {
                    show: false
                },
                background: '#FFFFFF',
                series: chartData.series,
                animation: true,
                width: _self.cWidth - 80,
                height: _self.cHeight - 80,
                disablePieStroke: true,
                dataLabel: false,
                extra: {
                    pie: {
                        ringWidth: 30,
                        lableWidth: 0,
                        activeRadius: 10
                    }
                }
            });
        },
        // 会员消费
        showRingChart(canvasId, chartData) {
            canvaRing = new UCharts({
                $this: _self,
                canvasId: canvasId,
                type: 'ring',
                fontSize: 11,
                // title: {
                //     name: _self.memberAnalysisInfo.customerSum,
                //     color: '#7cb5ec',
                //     fontSize: 20
                // },
                extra: {
                    pie: {
                        ringWidth: 15,
                        labelWidth: 0
                    }
                },
                legend: {
                    show: false
                },
                background: '#FFFFFF',
                series: chartData.series,
                animation: true,
                width: _self.cWidth - 80,
                height: _self.cHeight - 80,
                disablePieStroke: true,
                dataLabel: false
            });
        },
        // 饼状图tools
        touchPie(e) {
            canvaPie.showToolTip(e, {
                format: function (item) {
                    return item.name + ':' + item.data + '%';
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
                    return item.name + ':' + item.data + '%';
                }
            });
        },
        moveRing(e) {
            this.touchRing(e);
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
        memberAnalysisInfo() {
            this.$nextTick(() => {
                this.getWaterMarker();
                const showPieChart = uni.createSelectorQuery().select('.showPieChart');
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
