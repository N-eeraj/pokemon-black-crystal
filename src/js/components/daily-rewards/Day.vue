<template>
    <div
        class="day-container"
        :class="{ 'is-completed': isCompleted }">
        <strong class="day-number">
            Day {{ day }}
        </strong>

        <div class="reward">
            <template v-if="isCompleted">
                <img
                    src="@/assets/icons/checkmark.svg"
                    alt="Completed"
                    class="check-mark" />
            </template>
            <template v-else>
                <img
                    :src="require(`@/assets/images${image}`)"
                    :alt="`Day ${day} rewards`"
                    class="image" />
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'daily-rewards-day',
        props: {
            day: {
                type: Number,
                required: true
            },
            isCompleted: {
                type: Boolean,
                required: false,
                default: false
            },
            image: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/daily-rewards/day.scss"></style>