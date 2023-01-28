<template>
    <div>
        
        <div id="arcade_tent">

            <tent-selection />

        </div>

    </div>
</template>

<script>

    import TentSelection from '@/js/components/TentSelection.vue'

    import { mapActions } from 'vuex'

    export default {
        name: 'arcade-tent',

        components: {
            TentSelection
        },

        ...mapActions([
            'startArcade',
            'winArcade'
        ])
    }
</script>