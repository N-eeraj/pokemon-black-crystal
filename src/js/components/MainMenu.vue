<template>
    <div id="main_menu">

        <header class="menu-header">
            <img
                :src="soundImage"
                alt="Sound Toggle"
                class="icon"
                @click="toggleSound" />

            <div class="player-coins">
                <img
                    src="@/assets/images/coin.svg"
                    alt="PokeCoin" />
                {{ playerCoins }}
            </div>

            <img
                src="@/assets/icons/info.svg"
                alt="Info"
                class="icon" />
        </header>

        <main class="menu-actions-container"></main>

        <footer class="menu-footer"></footer>

    </div>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "main-menu",

        computed: {
            soundImage() {
                return require(`@/assets/icons/sound-${ this.soundStatus ? 'on': 'off' }.svg`)
            },

            ...mapGetters([
                'soundStatus',
                'playerCoins'
            ])
        },

        methods: {
            ...mapActions([
                'toggleSound'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/mainMenu.scss"></style>