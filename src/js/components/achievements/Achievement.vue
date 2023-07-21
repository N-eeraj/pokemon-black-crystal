<template>
    <template v-for="(requirement, level) in required">
        <div class="achievement-card">
            <div class="text-container">
                <span class="achievement-name">
                    {{ name }}
                </span>
                <div class="requirement">
                    {{ `${requirement < current ? requirement : current}/${requirement}` }}
                </div>
            </div>
            <img
                :src="badge"
                :alt="`${name}-${getLevelClass(level)}`"
                class="badge"
                :class="getLevelClass(level)" />
            <progress
                :value="current"
                :max="requirement"
                class="progress" />
        </div>
    </template>
</template>

<script>
    export default {
        name: 'achievement',

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
            }
        },

        methods: {
            getLevelClass(index) {
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
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/item.scss"></style>