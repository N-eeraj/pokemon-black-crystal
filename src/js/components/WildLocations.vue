<template>
    <div id="wild_locations">

        <navigation-bar
            icon="cross-mark"
            @iconEvent="$router.push('/')" />

            <div class="locations-list">
                <location-banner
                    v-for="(location, index) in locations"
                    :image="location.image"
                    :title="location.title"
                    :overlay="location.overlay"
                    :key="index"
                    @click="$emit('selectedLocation', location.title)" />

                <location-banner
                    image="images/wild/legendary.png"
                    title="Legendary Hunt"
                    overlay="linear-gradient(270deg, #7080, #708)"
                    @click="$emit('legendaryHunt')" />
            </div>

    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import LocationBanner from '@/js/components/LocationBanner.vue'


    export default {
        name: 'wild-locations',

        components: {
            NavigationBar,
            LocationBanner
        },

        data() {
            return {
                locations: [
                    {
                        image: 'images/wild/locations/mountain.png',
                        title: 'mountain',
                        overlay: 'linear-gradient(270deg, #8000, #800)'
                    },
                    {
                        image: 'images/wild/locations/field.png',
                        title: 'field',
                        overlay: 'linear-gradient(270deg, #8800, #880)'
                    },
                    {
                        image: 'images/wild/locations/forest.png',
                        title: 'forest',
                        overlay: 'linear-gradient(270deg, #0800, #080)'
                    },
                    {
                        image: 'images/wild/locations/pond.png',
                        title: 'pond',
                        overlay: 'linear-gradient(270deg, #0870, #087)'
                    },
                    {
                        image: 'images/wild/locations/sea.png',
                        title: 'sea',
                        overlay: 'linear-gradient(270deg, #0080, #008)'
                    }
                ]
            }
        }
    }

</script>


<style lang="scss" src="@/styles/modes/wildLocations.scss"></style>