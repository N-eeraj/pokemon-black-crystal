<template>
    <div>
        <div id="gym_bages">

            <navigation-bar
                title="Badges"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

            <div class="gym-bages-container">
                <div
                    v-for="(badge, index) in badges"
                    :key="index"
                    class="badge-container">
                    <img
                        v-if="playerLevel >= badge.level"
                        :src="require(`@/assets/images/gym-badges/${badge.name}.svg`)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"

    import { mapGetters } from "vuex"

    import data from "@/assets/data/gym-levels.json"

    export default {
        name: 'gym-badges',

        components: {
            NavigationBar
        },

        data() {
            return {
                badges: null
            }
        },

        computed: {
            ...mapGetters([
                'playerLevel'
            ])
        },

        created() {
            this.badges = data
        }
    }
</script>

<style lang="scss" src="@/styles/gymBadges.scss"></style>