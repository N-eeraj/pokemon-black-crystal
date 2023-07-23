<template>
    <template
        v-for="(requirement, level) in required"
        :key="level">
        <div
            v-if="level <= currentLevel"
            class="achievement-card"
            :class="{ achieved: checkAchievement(level), 'single-achievement': isSingleAchievement }">

            <div class="text-container">
                <span class="achievement-name">
                    {{ getRequiredText(requirement) }}
                </span>
                <div
                    v-if="!checkAchievement(level)"
                    class="requirement">
                    {{ `${formatNumber(current)}/${formatNumber(requirement)}` }}
                </div>
            </div>

            <img
                :src="require(`@/assets/images/achievements/${badge}`)"
                :alt="`${name}-${getLevelClass(level)}`"
                class="badge"
                :class="getLevelClass(level)" />

            <progress
                v-if="!checkAchievement(level)"
                :value="current"
                :max="requirement"
                class="progress" />

        </div>
    </template>
</template>

<script>
    export default {
        name: 'achievement-item',

        props: {
            name: {
                type: String,
                required: true
            },
            badge: {
                type: String,
                required: true
            },
            required: {
                type: Array,
                required: true
            },
            current: {
                type: Number,
                required: false,
                default: 0
            }
        },

        computed: {
            currentLevel() {
                let level = 0
                this.required.forEach(requirement => requirement <= this.current && level++)
                return level
            },

            isSingleAchievement() {
                return this.required.length === 1 && this.required[0] === 1
            }
        },

        methods: {
            getLevelClass(index) {
                if (this.required.length === 1) return 'gold'
                switch (index) {
                    case 0:
                        return 'base'
                    case 1:
                        return 'bronze'
                    case 2:
                        return 'silver'
                    case 3:
                        return 'gold'
                }
            },

            checkAchievement(level) {
                return level < this.currentLevel
            },

            getRequiredText(requirement) {
                return this.name.replace(/<Count>/gi, Intl.NumberFormat('en-US').format(requirement))
            },

            getRounded(number) {
                const rounded = number.toFixed(1)
                if (Number(rounded.at(-1)))
                    return rounded
                return rounded.slice(0, -2)
            },

            formatNumber(number) {
                if (number <= 1000) return number
                if (number < 1_000_000)
                    return `${this.getRounded(number/1_000)}k`
                return `${this.getRounded(number/1_000_000)}m`
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/item.scss"></style>