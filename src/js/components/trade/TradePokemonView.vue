<template>
    <div id="trade_pokemon">
        <trade-pokemon
            v-if="peer"
            :pokemon="peer"
            is-peer />
        <div v-else></div>
        
        <div
            v-if="showAccept"
            class="accept-trade"
            :class="{ active: client && peer}">
            <hr class="divider">
            <button
                class="accept-button"
                @click="acceptTrade">
                Accept
            </button>
        </div>

        <trade-pokemon
            v-if="client"
            :pokemon="client" />
    </div>
</template>

<script>

    import TradePokemon from '@/js/components/trade/TradePokemon.vue'

    export default {
        name: 'trade-pokemon-view',

        components: {
            TradePokemon
        },

        props: {
            client: {
                type: Object,
                required: true
            },
            peer: {
                type: Object,
                required: false
            },
            showAccept: {
                type: Boolean,
                required: false,
                default: true
            }
        },

        methods: {
            acceptTrade() {
                this.$emit('acceptTrade')
            }
        }
    }
</script>

<style lang="scss" src="@/styles/modes/trade/pokemonView.scss"></style>