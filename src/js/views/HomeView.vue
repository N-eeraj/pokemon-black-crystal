<template>
    <div>
        <div
            class="home-container"
            :style="`background-image: url(${characterImage});`">

            <div class="home-icons-container">
                <img
                    src="@/assets/images/home-icons/pokedex.svg"
                    alt="Pokedex">
                <img
                    src="@/assets/images/home-icons/badges.svg"
                    alt="Gym Badges">
                <img
                    src="@/assets/images/home-icons/achievements.svg"
                    alt="Achievements">
            </div>

            <div class="home-icons-container">
                <img
                    src="@/assets/images/home-icons/party.svg"
                    alt="Party Pokemon">
                <img
                    src="@/assets/images/home-icons/pc.svg"
                    alt="PC Pokemon">
            </div>

            <button
                class="main-menu"
                :class="{ open: openMenu }"
                @click="toggleMenu">
                <span></span>
            </button>

        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: "onboarding-view",

        data() {
            return {
                openMenu: false
            }
        },

        computed: {
            characterImage() {
                return require(`@/assets/images/characters/main-character/character-${this.getAvatar}.gif`)
            },

            ...mapGetters([
                'getAvatar'
            ])
        },

        methods: {
            toggleMenu() {
                this.openMenu = !this.openMenu
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home.scss"></style>