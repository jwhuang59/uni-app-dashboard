<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data() {
        return {};
    },
    props: {
        notesText: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: ''
        },
        left: {
            type: String,
            default: ''
        },
        top: {
            type: String,
            default: ''
        },
        isNotes: {
            type: Boolean,
            default: false
        }
    },
    methods: {}
};
</script>
