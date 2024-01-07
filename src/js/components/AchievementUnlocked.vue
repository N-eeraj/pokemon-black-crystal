<template>
    <transition name="achievement-unlocked">
        <div v-if="achievementUnlocked" id="achievement-unlocked" @click="viewAchievement">
            {{ achievementUnlocked }}
        </div>
    </transition>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'achievement-unlocked',

        computed: {
            ...mapGetters([,
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