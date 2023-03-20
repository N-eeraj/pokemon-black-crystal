<template>
    <div
        id="champion_container"
        :style="`background-image: url(${characterImage});`">

        <navigation-bar
            icon="cross-mark"
            @icon-event="$router.push('/')" />

        <h1 class="message">
            You are the CHAMPION
        </h1>
    </div>
</template>

<script>
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    import { mapGetters } from 'vuex'

    export default {
        name: 'champion-screen',

        components: {
            NavigationBar
        },

        computed: {
            characterImage() {
                let avatarId = this.playerInfo.avatar
                return require(`@/assets/images/characters/main-character/character-${avatarId}.gif`)
            },

            ...mapGetters([
                'playerInfo'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/screens/champion.scss"></style>