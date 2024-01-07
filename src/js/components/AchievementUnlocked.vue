<template>
    <transition name="achievement-unlocked">
        <div v-if="achievementUnlocked.show" id="achievement-unlocked">
            {{ achievementUnlocked }}
        </div>
    </transition>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'achievement-unlocked',
        computed: {
            ...mapGetters([,
                'achievementUnlocked'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/achievementUnlocked.scss"></style>