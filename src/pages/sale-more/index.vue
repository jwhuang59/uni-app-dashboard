<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {
            allSaleProvinceInfo: ''
        };
    },
    onLoad() {
        this.allSaleProvinceInfo = this.getRouteParams();
    },
    methods: {}
};
</script>
