<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {};
    },
    onShow() {
        this.jumpTab('liveData');
        // const hasUserInfo = this.$store.state.userInfo;
        // if (hasUserInfo) {
        //     setTimeout(() => {
        //         this.reLaunch('liveData');
        //     }, 1500);
        // } else {
        //     this.jump('authorize');
        // }
    }
};
</script>
