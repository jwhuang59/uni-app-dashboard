<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
export default {
    props: {
        getTest: {
            type: Array,
            default: () => []
        }
        // getTest: Array
    },
    data() {
        return {
            text: '测试'
        };
    },
    onLoad() {
        // console.log()
    },
    mounted() {
        this.text = this.getTest[0];
        console.log(this.getTest);
    },
    methods: {
        isTest() {
            // this.$emit('testFunc',this.text)
            // this.editText = '改变了';
            // console.log(this.getTest);
        }
    }
    // watch: {
    //     getTest() {
    //         return `${this.getTest}`;

    //     }
    // }
};
</script>
