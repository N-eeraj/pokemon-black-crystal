<template>
    <div
        class="overlay"
        :class="{'show-gifts': hasReward}">
        <transition name="daily-rewards">
            <div
                v-if="hasReward"
                class="modal">
                <img
                    src="@/assets/images/daily-rewards-title.png"
                    alt="Daily Rewards"
                    class="title" />

                <div class="content">
                    <day
                        v-for="({image}, index) in rewardList"
                        :day="index + 1"
                        :is-completed="index < streak"
                        :image="image"
                        :key="index" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Day from '@/js/components/DailyRewards/Day.vue'

    import { mapActions, mapGetters } from 'vuex'

    import { getRandomFromList } from '@/js/mixins/randomGenerator'
    import rewardList from '@/assets/data/daily-rewards'

    export default {
        name: 'daily-rewards',
        components: {
            Day
        },

        data() {
            return {
                hasReward: false,
                streak: 0,
                rewardList: [],
                receivedRewards: []
            }
        },

        async created() {
            this.hasReward = await this.checkDailyReward()
            if (!this.hasReward) return
            this.rewardList = rewardList
            this.streakUpdation()
        },

        computed: {
            ...mapGetters([
                'dailyRewardsStreak'
            ])
        },

        methods: {
            streakUpdation() {
                this.streak = this.dailyRewardsStreak - 1
                setTimeout(() => {
                    ++this.streak
                }, 1000)
            },

            ...mapActions([
                'checkDailyReward'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/dailyRewards/main.scss"></style>