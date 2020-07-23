<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            title: 'Hello',
            date: '2020-07-18 08:09:00',
            currentEnv: process.env.VUE_APP_BASE_URL,
            nodeEnv: process.env.NODE_ENV
        };
    },
    computed: {
        ...mapState(['shop'])
    },
    onLoad() {
        this.$request('shopIndex', { shopId: 10543 }).then(res => {});
        setTimeout(() => {
            this.$store.commit({
                type: 'save_shop_info',
                playload: {
                    name: '测试门店'
                }
            });
        }, 3000);
        console.log('测试Utils方法：', this.$utils.isNotEmpty({}));
    },
    methods: {
        clickHandler(pathName) {
            console.log(pathName);
            this.jump(pathName, {
                id: '123'
            });
        },
        clickTabHandler(pathName) {
            this.jumpTab(pathName);
        }
    }
};
</script>
