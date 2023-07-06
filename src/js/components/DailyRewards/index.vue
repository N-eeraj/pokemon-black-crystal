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

        <daily-rewards-pop-up
            :rewards="receivedRewards"
            @close="hasReward = false" />
    </div>
</template>

<script>
    import Day from '@/js/components/DailyRewards/Day.vue'
    import DailyRewardsPopUp from '@/js/components/pop-up/DailyRewardsPopUp.vue'

    import { mapActions, mapGetters } from 'vuex'

    import { getRandomFromList } from '@/js/mixins/randomGenerator'
    import rewardList from '@/assets/data/daily-rewards'

    export default {
        name: 'daily-rewards',
        components: {
            Day,
            DailyRewardsPopUp
        },

        data() {
            return {
                hasReward: false,
                streak: 0,
                receivedRewards: []
            }
        },

        async created() {
            this.hasReward = await this.checkDailyReward()
            if (!this.hasReward) return
            this.streakUpdation()
        },

        computed: {
            rewardList() {
                return rewardList
            },

            ...mapGetters([
                'dailyRewardsStreak'
            ])
        },

        methods: {
            streakUpdation() {
                this.streak = this.dailyRewardsStreak - 1
                setTimeout(() => {
                    this.rewardCollection()
                    ++this.streak
                }, 1000)
            },

            rewardCollection() {
                setTimeout(() => {
                    const { fixed, items } = rewardList[this.dailyRewardsStreak]
                    this.receivedRewards = fixed ? items : this.handleRewardChances(items)
                    this.receivedRewards.forEach(({ itemId, count }) => {
                        this.updateBag({
                            itemId,
                            count
                        })
                    })
                }, 2000);
            },

            handleRewardChances(items) {
                const chances = []
                items.forEach(({chance, ...item}) => {
                    for (let i = 0; i < chance; i++)
                        chances.push(item)
                })
                return [getRandomFromList(chances)]
            },

            ...mapActions([
                'checkDailyReward',
                'updateBag'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/dailyRewards/main.scss"></style>