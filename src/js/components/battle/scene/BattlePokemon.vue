<template>
    <div
        class="battle-pokemon"
        :class="view">

        <div v-if="!canCatch">
            <img
                v-for="(index) of partySize"
                src="@/assets/images/pokeball-icon.png"
                :key="index"
                class="party-size-icon"
                :class="{ fainted: index <= partySize - currentPartySize }"
                :alt="index" />
        </div>
        <div
            class="status"
            :class="{ caught: catchStatus?.caught }">
            <div class="types-list">
                <type-icon
                    v-for="(type, index) in pokemon.types"
                    :type="type"
                    :key="index"
                    class="type" />
            </div>

            <strong>
                {{ $filters.toTitleCase(pokemon.name) }}
            </strong>
            <span>
                Level
                {{ pokemon.level }}
            </span>

            <progress
                :value="pokemon.currentHp"
                :max="pokemon.stat.hp"
                :class="hpClass" />
        </div>

        <div class="pokemon">
            <img
                v-if="catchStatus?.ballUsed"
                :src="require(`@/assets/images/items${pokeball}`)"
                class="pokeball-image"
                :class="{ caught: catchStatus.caught }" />
            <img
                v-else
                :src="pokemon.sprite[view]"
                class="pokemon-image" />
        </div>

    </div>
</template>

<script>

    import TypeIcon from '@/js/components/TypeIcon.vue'

    import { mapGetters } from 'vuex'

    import items from '@/assets/data/items'

    export default {
        name: 'battle-pokemon',

        components: {
            TypeIcon
        },

        props: {
            pokemon: {
                type: Object,
                required: true
            },
            canCatch: {
                type: Boolean,
                required: false,
                default: false,
            },
            catchStatus: {
                type: Object,
                required: false
            },
            isFoe: {
                type: Boolean,
                required: false,
                default: false
            },
            partySize: {
                type: Number,
                required: true
            }
        },

        computed: {
            view() {
                return this.isFoe ? 'front' : 'back'
            },

            trainer() {
                return this.isFoe ? 'foe' : 'trainer'
            },

            hpClass() {
                const healthPercentage = this.pokemon.currentHp / this.pokemon.stat.hp
                if (healthPercentage > 0.65) return 'high'
                if (healthPercentage > 0.25) return 'medium'
                return 'low'
            },

            pokeball() {
                return items.find(item => item.id == this.catchStatus.ballUsed).image
            },

            currentPartySize() {
                return this.battleData[this.trainer].partyList.length
            },

            ...mapGetters([
                'battleData'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/battle/pokemon.scss"></style>