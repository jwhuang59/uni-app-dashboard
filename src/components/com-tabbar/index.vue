<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {
            tabList: [
                {
                    text: '销售',
                    tabName: 'sale',
                    src: '../../static/images/tabbar/icon_sale.png',
                    selectSrc: '../../static/images/tabbar/icon_selectSale.png'
                },
                {
                    text: '活动',
                    tabName: 'activity',
                    src: '../../static/images/tabbar/icon_activity.png',
                    selectSrc: '../../static/images/tabbar/icon_selectActivity.png'
                },
                {
                    text: '实时数据',
                    tabName: 'liveData',
                    src: '',
                    selectSrc: ''
                },
                {
                    text: '客户',
                    tabName: 'customer',
                    src: '../../static/images/tabbar/icon_customer.png',
                    selectSrc: '../../static/images/tabbar/icon_selectCustomer.png'
                },
                {
                    text: '转化',
                    tabName: 'conversion',
                    src: '../../static/images/tabbar/icon_conversion.png',
                    selectSrc: '../../static/images/tabbar/icon_selectConversion.png'
                }
            ],
            currentTabIndex: this.current
        };
    },
    props: {
        current: {
            type: [Number, String],
            default: 0
        },
        backgroundColor: {
            type: String,
            default: '#fbfbfb'
        },
        color: {
            type: String,
            default: '#2D2D32'
        },
        tintColor: {
            type: String,
            default: '#42b983'
        }
    },
    mounted() {
        // uni.hideTabBar();
    },
    methods: {
        switchTab(index, tagName) {
            this.jumpTab(tagName);
        }
    }
};
</script>
