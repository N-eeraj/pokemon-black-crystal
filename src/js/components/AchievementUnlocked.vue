<template>
    <transition name="achievement-unlocked">
        <div v-if="achievementUnlocked" id="achievement-unlocked" @click="viewAchievement">
        <img
            :src="require(`@/assets/images/achievements/${achievementUnlocked.badge}`)"
            :alt="`${achievementUnlocked.title}-${achievementUnlocked.level}`"
            class="badge"
            :class="achievementUnlocked.level" />
            {{ achievementUnlocked.title }}
        </div>
    </transition>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'achievement-unlocked',

        computed: {
            ...mapGetters([
                'achievementUnlocked'
            ])
        },

        watch: {
            achievementUnlocked(to) {
                if (to)
                    setTimeout(this.unlockAchievement, 2500)
            }
        },

        methods: {
            viewAchievement() {
                this.unlockAchievement()
                this.$router.push('/achievements')
            },
            ...mapActions([
                'unlockAchievement'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/achievementUnlocked.scss"></style>