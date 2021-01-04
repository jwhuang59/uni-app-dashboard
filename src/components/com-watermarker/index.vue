<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {};
    },
    props: {
        text: {
            type: String,
            default: '我是水印'
        },
        opacity: {
            type: [Number, String],
            default: 1
        },
        rotate: {
            type: String,
            default: '-30deg'
        },
        color: {
            type: String,
            default: '#d6d5d5'
        },
        row: {
            type: [Number, String],
            default: 3
        },
        col: {
            type: [Number, String],
            default: 7
        },
        flexHeight: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: true
        }
    }
};
</script>
