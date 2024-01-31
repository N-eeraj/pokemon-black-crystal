<template>
    <transition name="menu">
        <div
            v-if="open"
            id="main_menu">
            <header class="menu-header">
                <img
                    src="@/assets/icons/settings.svg"
                    alt="Sound Toggle"
                    class="icon"
                    @click="$router.push('/settings')" />

                <div class="player-coins">
                    <img
                        src="@/assets/images/coin.svg"
                        alt="PokeCoin" />
                    {{ $filters.numberFormat(playerCoins) }}
                </div>

                <img
                    src="@/assets/icons/info.svg"
                    alt="Info"
                    class="icon"
                    @click="$router.push('/info')" />
            </header>

            <main class="menu-actions-container">

                <button
                    v-for="(action, index) in menuActions"
                    :key="index"
                    class="menu-action"
                    @click="$router.push(action.to)">
                    <img
                        :src="require(`@/assets/images/home-icons/menu-icons/${action.icon}.svg`)"
                        :alt="action.name"
                        class="icon" />
                    <span class="name">
                        {{ action.name }}
                    </span>
                </button>

            </main>

            <footer class="menu-footer">
                <div
                    class="menu-footer-action"
                    @click="$router.push('/shop')">
                    Shop
                    <img
                        src="@/assets/images/home-icons/menu-icons/shop.svg"
                        alt="Shop"
                        class="icon" />
                </div>
                <div
                    class="menu-footer-action"
                    @click="$router.push('/bag')">
                    Bag
                    <img
                        src="@/assets/images/home-icons/menu-icons/bag.svg"
                        alt="Bag"
                        class="icon" />
                </div>
            </footer>
        </div>
    </transition>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: 'main-menu',

        props: {
            open: {
                type: Boolean,
                require: false,
                default: false
            }
        },

        data() {
            return {
                menuActions: [
                    {
                        name: 'Story Mode',
                        icon: 'story-mode',
                        to: '/mode/story'
                    },
                    {
                        name: 'Exploration',
                        icon: 'exploration',
                        to: '/mode/exploration'
                    },
                    {
                        name: 'Arcade',
                        icon: 'arcade',
                        to: 'mode/arcade'
                    },
                    {
                        name: 'PVP',
                        icon: 'pvp',
                        to: '/mode/pvp'
                    },
                    {
                        name: 'Trade',
                        icon: 'trade',
                        to: '/mode/trade'
                    },
                    {
                        name: 'Carnival',
                        icon: 'carnival',
                        to: '/mode/carnival'
                    }
                ]
            }
        },

        computed: {
            ...mapGetters([
                'playerCoins'
            ])
        },
    }
</script>

<style lang="scss" src="@/styles/home/mainMenu.scss"></style>