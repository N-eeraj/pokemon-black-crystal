<template>
    <div id="wild_locations">

        <navigation-bar
            icon="cross-mark"
            @icon-event="$router.push('/')" />

            <div class="locations-list">
                <banner-card
                    v-for="(location, index) in locations"
                    :image="location.image"
                    :title="location.title"
                    :overlay="location.overlay"
                    :key="index"
                    @click="$emit('selectedLocation', location.title)" />

                <banner-card
                    image="images/wild/legendary.png"
                    title="Legendary Hunt"
                    overlay="linear-gradient(270deg, #7080, #708)"
                    @click="$emit('legendaryHunt')" />
            </div>

    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import BannerCard from '@/js/components/UI/BannerCard.vue'

    import { mapActions } from 'vuex'

    import locations from '@/assets/data/locations.json'

    export default {
        name: 'wild-locations',

        components: {
            NavigationBar,
            BannerCard
        },

        data() {
            return {
                locations
            }
        },

        mounted() {
            this.updateAudio('wild.mp3')
        },

        methods: {
            ...mapActions([
                'updateAudio'
            ])
        }
    }

</script>


<style lang="scss" src="@/styles/modes/wildLocations.scss"></style>