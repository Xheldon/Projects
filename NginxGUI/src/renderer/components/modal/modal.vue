<template>
    <div class="modal">
        {{title}}
        <input :type="type" :value="value">
        <button @click="confirm">确认</button>
        <button @click="cancel">取消</button>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: '请输入'
            },
            type: {
                type: String,
                default: 'text'
            },
            value: {
                type: String
            }
        },
        methods: {
            confirm () {
                this.$emit('confirm', this.value);

            },
            cancel () {
                this.$emit('cancel');
            }
        }
    }
</script>
<style scoped>
    .modal {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .modal input {
        width: 200px;
        height: 50px;
        border: none;
        background-color: gray;
    }
</style>