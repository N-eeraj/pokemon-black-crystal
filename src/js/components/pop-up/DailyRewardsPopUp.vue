<template>
    <pop-up
        :show="rewards.length"
        class="daily-reward-pop-up">
        <template #title>
            You Received
        </template>
        <template #body>
            <div
                v-for="({image, count}, index) in rewardItems"
                :key="index"
                class="reward-item">
                <img
                    :src="require(`@/assets/images/items${image}`)"
                    class="image" />
                <span class="count">
                    {{ count }}
                </span>
            </div>
        </template>
        <template #actions>
            <button
                class="confirm"
                @click="$emit('close')">
                Ok
            </button>
        </template>
    </pop-up>
</template>

<script>
    import PopUp from '@/js/components/UI/PopUp.vue'

    import items from '@/assets/data/items'

    export default {
        name: 'daily-rewards-pop-up',
        components: {
            PopUp
        },

        props: {
            rewards: {
                type: Array,
                required: true
            }
        },

        computed: {
            rewardItems() {
                return this.rewards.map(({itemId, count}) => {
                    const { image } = items.find(({id}) => id === itemId)
                    return { image, count }
                })
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/daily-rewards/popUp.scss"></style>