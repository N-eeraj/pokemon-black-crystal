<template>
    <div id="trade_pokemon">
        
        <div
            class="accept-trade"
            :class="{ active: client && peer}">
            <hr class="divider">
            <button
                class="accept-button"
                @click="acceptTrade">
                Accept
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'trade-pokemon',

        props: {
            client: {
                type: Object,
                required: true
            },
            peer: {
                type: Object,
                required: false
            }
        },

        methods: {
            acceptTrade() {
                this.$emit('acceptTrade')
            }
        }
    }
</script>

<style lang="scss" src="@/styles/modes/trade/pokemon.scss"></style>