export default [
    {
        /** 实时数据时间 */
        name: 'getTime',
        url: '/instant/time',
        sld: false
    },
    {
        /** 实时销售数据 */
        name: 'getLiveSale',
        url: '/instant/sales',
        sld: false
    },
    {
        /** 全国会员数据 */
        name: 'getLiveCustomer',
        url: '/instant/customer',
        sld: false
    },
    {
        /** 实时销售排行 */
        name: 'getSaleRanking',
        url: '/instant/leaderboard',
        sld: false
    },
    {
        /** 离线销售数据 */
        name: 'getOfflineSale',
        url: '/offline/sales',
        sld: false
    },
    {
        /** 各省份销售数据 */
        name: 'getProvinceSale',
        url: '/offline/province/sales',
        sld: false
    },
    {
        /** 活动列表 */
        name: 'activityList',
        url: '/offline/activity/list',
        sld: false
    },
    {
        /** 活动分析 */
        name: 'activityAnalysis',
        url: '/offline/activity/analysis',
        sld: false
    },
    {
        /** 活动排行 */
        name: 'activityRanking',
        url: '/offline/activity/ranking',
        sld: false
    },
    {
        /** 活动图表 */
        name: 'activityGraph',
        url: '/offline/activity/graph',
        sld: false
    },
    {
        /** 定向对比 */
        name: 'directionalContrast',
        url: '/offline/activity/directional/analysis',
        sld: false
    },
    {
        /** 会员留存复购 */
        name: 'memberRetention',
        url: '/offline/member/retention',
        sld: false
    },
    {
        /** 会员分析数据 */
        name: 'memberAnalysis',
        url: '/offline/member/sales',
        sld: false
    },
    {
        /** 转化分析数据 */
        name: 'conversionAnalysis',
        url: '/offline/conversion/analysis',
        sld: false
    }
];
