<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {
            orderAnalysis: ''
        };
    },
    onLoad(options) {
        this.orderAnalysis = this.$Route.query;
    },
    methods: {}
};
</script>
