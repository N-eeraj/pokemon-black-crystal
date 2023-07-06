<template>
    <div class="day-container">
        <strong class="day-number">
            Day {{ day }}
        </strong>
    </div>
</template>

<script>
    export default {
        name: 'daily-rewards-day',
        props: {
            day: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/dailyRewards/day.scss"></style>