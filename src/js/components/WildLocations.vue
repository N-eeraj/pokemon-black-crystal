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
                    v-if="canEnterSafariZone"
                    image="images/wild/safari-zone.png"
                    title="Safari Zone"
                    overlay="linear-gradient(270deg, #0000, #0007)"
                    @click="handleSafariZone" />

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
                locations,
                canEnterSafariZone: false,
                unixtime: null,
                interval: null
            }
        },

        async mounted() {
            this.updateAudio('wild.mp3')
            const { unixtime, canEnter } = await this.checkSafariZoneEntry()
            this.canEnterSafariZone = canEnter
            if (!this.canEnterSafariZone) return
            this.unixtime = unixtime
            const interval = setInterval(() => this.unixtime += 100, 100)
            this.interval = interval
        },

        methods: {
            handleSafariZone() {
                clearInterval(this.interval)
                this.$emit('safariZone', this.unixtime)
            },

            ...mapActions([
                'updateAudio',
                'checkSafariZoneEntry'
            ])
        }
    }

</script>


<style lang="scss" src="@/styles/modes/wildLocations.scss"></style>