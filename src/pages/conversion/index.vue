<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {
            flexHeight: '', // 水印高度
            waterMarkerText: '', // 水印内容
            isWaterMarker: false, // 水印状态
            calendarIndex: '', // 对比日历下标
            currentDate: '', // 默认日期段
            currentDateContrast: '', // 对比默认日期段
            flowDate: '', // 流量时间
            flowDateContrast: '', // 流量对比时间
            startDate: '', // 开始日期时间戳
            endDate: '', // 结束日期时间戳
            startDateContrast: '', // 对比开始日期时间戳
            endDateContrast: '', // 对比结束日期时间戳
            showCalendar: false, // 日历组件
            getMaxDate: '', // 日历可选最大日期
            conversionAnalysisInfo: '' // 转化分析数据
        };
    },
    created() {
        this.getCurrentDate();
    },
    onLoad() {
        this.getConversionAnalysis();
    },
    mounted() {
        // 添加全屏水印
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
    },
    methods: {
        // 获取对比日期段
        getCurrentDate() {
            const yesterday = new Date();
            const beforeYesterday = new Date();

            // 选择日期
            yesterday.setDate(yesterday.getDate() - 1);
            beforeYesterday.setDate(beforeYesterday.getDate() - 2);
            const yesterdayDate = this.dayjs(yesterday).format('YYYY.M.DD');
            const beforeYesterdayDate = this.dayjs(beforeYesterday).format('YYYY.M.DD');
            this.currentDate = beforeYesterdayDate + ' - ' + yesterdayDate;
            this.startDate = this.dayjs(beforeYesterdayDate.replace(/\./g, '-')).valueOf();
            this.endDate = this.dayjs(yesterdayDate.replace(/\./g, '-')).valueOf();
            this.flowDate = this.dayjs(beforeYesterday).format('M.DD') + ' - ' + this.dayjs(yesterday).format('M.DD');
            // 对比日期
            yesterday.setMonth(yesterday.getMonth() - 1);
            beforeYesterday.setMonth(beforeYesterday.getMonth() - 1);
            const yesterdayDate0 = this.dayjs(yesterday).format('YYYY.M.DD');
            const beforeYesterdayDate0 = this.dayjs(beforeYesterday).format('YYYY.M.DD');
            this.currentDateContrast = beforeYesterdayDate0 + ' - ' + yesterdayDate0;
            this.startDateContrast = this.dayjs(beforeYesterdayDate0.replace(/\./g, '-')).valueOf();
            this.endDateContrast = this.dayjs(yesterdayDate0.replace(/\./g, '-')).valueOf();
            this.flowDateContrast =
                this.dayjs(beforeYesterday).format('M.DD') + ' - ' + this.dayjs(yesterday).format('M.DD');
        },
        selectCalendar(i) {
            this.calendarIndex = i;
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
            switch (this.calendarIndex) {
                case 1:
                    this.startDate = this.dayjs(e.startDate).valueOf();
                    this.endDate = this.dayjs(e.endDate).valueOf();
                    this.currentDate = getDateSlot;
                    this.flowDate = e.startMonth + '.' + e.startDay + ' - ' + e.endMonth + '.' + e.endDay;
                    break;
                case 2:
                    this.startDateContrast = this.dayjs(e.startDate).valueOf();
                    this.endDateContrast = this.dayjs(e.endDate).valueOf();
                    this.currentDateContrast = getDateSlot;
                    this.flowDateContrast = e.startMonth + '.' + e.startDay + ' - ' + e.endMonth + '.' + e.endDay;
                    break;
            }
            this.getConversionAnalysis();
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
        // 转化分析数据
        getConversionAnalysis() {
            this.$request('conversionAnalysis', {
                preStartTime: this.startDate,
                preEndTime: this.endDate,
                rearStartTime: this.startDateContrast,
                rearEndTime: this.endDateContrast
            }).then(res => {
                this.conversionAnalysisInfo = res.data;
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
        conversionAnalysisInfo() {
            this.$nextTick(() => {
                this.getWaterMarker();
            });
        }
    }
};
</script>
