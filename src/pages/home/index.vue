<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
let hasUserInfo = null;
export default {
    data() {
        return {
            currentTime: '',
            userName: '',
            countdown: '3',
            isShow: false,
            timer: '' // 定时器
        };
    },
    created() {
        hasUserInfo = this.$store.state.userInfo;
        this.currentTime = this.dayjs().format('YYYY-MM-DD HH:mm:ss');
    },
    onShow() {
        if (!hasUserInfo) {
            this.jump('authorize');
        } else {
            this.userName = hasUserInfo.nickName;
            this.$nextTick(() => {
                this.countdownFunc();
            });
        }
    },
    mounted() {},
    methods: {
        countdownFunc() {
            this.timer = setInterval(() => {
                this.isShow = true;
                this.countdown = this.countdown - 1;
                if (this.countdown === 0) {
                    this.reLaunch('liveData');
                }
            }, 1000);
        },
        jumpDelay() {
            clearInterval(this.timer);
            this.reLaunch('liveData');
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>
