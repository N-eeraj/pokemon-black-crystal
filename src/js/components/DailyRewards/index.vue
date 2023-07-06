<template>
    <div class="overlay show-gifts">
        <div class="modal">
            <img
                src="@/assets/images/daily-rewards-title.png"
                alt="Daily Rewards"
                class="title" />

            <div class="content">
                <day
                    v-for="index of 7"
                    :day="index"
                    :key="index" />
            </div>
        </div>
    </div>
</template>

<script>
    import Day from '@/js/components/DailyRewards/Day.vue'

    export default {
        name: 'daily-rewards',
        components: {
            Day
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/dailyRewards/main.scss"></style>