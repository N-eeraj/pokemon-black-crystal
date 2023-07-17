<template>
    <div class="box-list">
        <button
            class="btn prev"
            @click="handleBoxChange(-1)" />
        
        <strong>
            {{ box }}
        </strong>

        <button
            class="btn next"
            @click="handleBoxChange(1)" />
    </div>
</template>

<script>
    export default {
        name: 'box-list',
        props: {
            box: {
                type: String,
                required: true
            }
        },
        methods: {
            handleBoxChange(change) {
                this.$emit('changeBox', change)
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/pc-boxes/boxList.scss"></style>