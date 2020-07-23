<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {
            id: '',
            list: [
                {
                    text: '点赞',
                    color: 'blue',
                    fontSize: 28
                },
                {
                    text: '分享'
                },
                {
                    text: '评论'
                }
            ],
            show: true
        };
    },
    onLoad() {
        // this.id = this.getRouteParams().id;
    },
    methods: {
        clickHandler() {
            this.back();
        }
    }
};
</script>
