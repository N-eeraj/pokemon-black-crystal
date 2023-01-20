<template>
    <div>
        <div id="exploration">

            <wild-locations
                @selectedLocation="handleLocation"
                @legendaryHunt="handleLegendaryHunt" />

        </div>
    </div>
</template>

<script>

    import WildLocations from '@/js/components/WildLocations.vue'


    export default {
        name: 'exploration-mode',

        components: {
            WildLocations
        },

        methods: {
            handleLocation(location) {
                console.log(location)
            },

            handleLegendaryHunt() {
                console.log('handleLegendaryHunt')
            }
        }
    }

</script>