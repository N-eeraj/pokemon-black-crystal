<template>
    <div>
        <div id="achievements">
            {{ playerAchievements }}
            <doughnut-chart
                :value="80"
                class="chart" />
        </div>
    </div>
</template>

<script>

    import DoughnutChart from '@/js/components/UI/DoughnutChart.vue'

    import { mapGetters } from 'vuex'


    export default {
        name: 'achievements-view',

        components: {
            DoughnutChart
        },

        computed: {
            ...mapGetters([
                'playerAchievements'
            ])
        },
    }
</script>