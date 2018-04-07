<template>
    <div class="modal">
        {{options.title}}
        <slot></slot>
        <button @click="over('ok')">{{options.ok}}</button>
        <button @click="over('no')">{{options.no}}</button>
    </div>
</template>
<script>
    export default {
        props: ['options'],
        methods: {
            over (action) {
                this.$emit(action)
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
        text-align: center;
        vertical-align: middle;
    }

    .modal input {
        width: 200px;
        height: 50px;
        border: none;
        background-color: gray;
    }
</style>