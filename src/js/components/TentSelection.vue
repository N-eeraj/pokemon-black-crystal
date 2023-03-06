<template>
    <div id="tent_selection">

        <navigation-bar
            icon="cross-mark"
            @click="$router.push('/mode/arcade')" />

        <h3 class="title">
            Select 3 Pokéballs
        </h3>

        <div class="pokeballs-container">
            <img
                v-for="index in 6"
                src="@/assets/images/pokeball.png"
                class="pokeball"
                :class="{ selected: selectedPokeballs.includes(index) }"
                :key="index"
                @click="addPokeBall(index)" />
        </div>

        <button
            v-if="selectedPokeballs.length === 3"
            class="confirm"
            @click="$emit('selectedPokeballs', selectedPokeballs)">
            Continue
        </button>

    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue';

    import { mapActions } from 'vuex'

    export default {
        name: 'tent-selection',

        components: {
            NavigationBar
        },

        data() {
            return {
                selectedPokeballs: []
            }
        },

        mounted() {
            this.updateAudio('arcade.mp3')
        },

        methods: {
            addPokeBall(index) {
                if (this.selectedPokeballs.includes(index)) {
                    this.selectedPokeballs = this.selectedPokeballs.filter(pokeball => pokeball !== index)
                    return
                }
                if (this.selectedPokeballs.length === 3) this.selectedPokeballs.shift()
                this.selectedPokeballs.push(index)
            },

            ...mapActions([
                'updateAudio'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/arcade/tentSelection.scss"></style>