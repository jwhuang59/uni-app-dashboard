<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    data(){
        return{
            isNotes:false
        }
    },
    props: {
        notesText: {
            type: String,
            default: '这是一条注释'
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
    methods: {
        
    },

};
</script>
