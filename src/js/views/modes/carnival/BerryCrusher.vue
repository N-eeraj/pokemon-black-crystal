<template>
    <div>
        <div id="berry_crusher">

            <h1 class="title">
                Berry Crusher
            </h1>

            <div class="crusher-container">
                <img
                    src="@/assets/images/carnival/berry-crusher/rotar.png"
                    class="rotar">
                <img
                    src="@/assets/images/carnival/berry-crusher/pointer.png"
                    class="pointer">
            </div>

            <p class="instructions">
                Click on the rotating berry crusher when the points meet. You can only press once per rotation.
            </p>


            <carnival-event-pop-up
                v-if="popUp.show"
                :image="require('@/assets/images/items/pokeblock.png')"
                item="Pokéblock"
                :victory="victory"
                :text="popUp.text" />

        </div>
    </div>
</template>

<script>

    import CarnivalEventPopUp from '@/js/components/CarnivalEventPopUp.vue'

    export default {
        name: 'berry-crusher',

        components: {
            CarnivalEventPopUp
        },

        data() {
            return {
                victory: null,
                popUp: {
                    show: false,
                    text: null
                }
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/berryCrusher.scss"></style>