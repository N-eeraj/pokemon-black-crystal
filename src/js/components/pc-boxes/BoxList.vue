<template>
    <div class="box-list">
        <button
            v-if="showNavigations"
            class="btn prev"
            @click="handleBoxChange(-1)" />
        
        <strong>
            {{ currentBox }}
        </strong>

        <button
            v-if="showNavigations"
            class="btn next"
            @click="handleBoxChange(1)" />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'box-list',
        props: {
            currentBox: {
                type: String,
                required: true
            }
        },
        computed: {
            showNavigations() {
                return Object.keys(this.pcPokemon).length > 1
            },
            ...mapGetters(['pcPokemon'])
        },
        methods: {
            handleBoxChange(change) {
                this.$emit('changeBox', change)
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/pc-boxes/boxList.scss"></style>