<template>
    <div class="doughnut-chart">
        <strong class="value">
            {{ value }}%
        </strong>
        <svg class="chart">
            <circle
                r="35%"
                cy="50%"
                cx="50%"
                fill="none"
                :class="color"
                :style="`stroke-dashoffset: ${ 220 - value * 2.2 }%;`" />
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'doughnut-chart',

        props: {
            value: {
                type: Number,
                required: true
            }
        },

        computed: {
            color() {
                if (this.value > 66) return 'high'
                if (this.value > 34) return 'medium'
                return 'low'
            }
        },
    }
</script>

<style lang="scss" src="@/styles/UI/doughnutChart.scss">
    
</style>