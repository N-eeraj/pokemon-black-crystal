<template>
    <div class="stat-value">
        <span class="stat-label">
            {{ label }}
        </span>
        <span>
            {{ value }}
        </span>
        <progress
            :value="value"
            :max="max"
            :class="getStatClass" />
    </div>
</template>

<script>
    export default {
        name: 'linear-progress',
        props: {
            label: {
                type: String,
                required: true
            },
            value: {
                type: Number,
                required: false,
                default: 0
            },
            max: {
                type: Number,
                required: false,
                default: 100
            }
        },

        computed: {
            getStatClass() {
                const percentage = this.value / this.max
                if (percentage > 0.65) return 'high'
                if (percentage > 0.25) return 'medium'
                return 'low'
            }
        }
    }
</script>