<template>
    <linear-progress
        v-for="(stat, index) in stats"
        :key="`stat-${index}`"
        :label="stat.label"
        :value="stat.value"
        :max="stat.max" />
</template>

<script>
    import LinearProgress from '@/js/components/UI/LinearProgress.vue'

    export default {
        name: 'pokemon-stats',
        components: { LinearProgress },
        props: {
            stats: {
                type: Array,
                required: true
            }
        }
    }
</script>