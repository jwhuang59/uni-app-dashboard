<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {};
    },

    onLoad() {
        setTimeout(() => {
            this.redirect('panel');
        }, 3000);
    }
};
</script>
