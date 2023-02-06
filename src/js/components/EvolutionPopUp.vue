<template>
    <pop-up
        v-if="evolutionList.length && currentPokemon.evolution"
        class="evolution-modal">

        <template #body>
            <div class="images-container">
                <img
                    v-if="status === 0 || status === 2"
                    :src="currentPokemon.image"
                    :alt="currentPokemon.name"
                    class="pokemon-img"
                    :class="{ 'evolution-progress': (status === 0), shrink: (showEvolution && status === 0 ) }" />
                <img
                    v-if="status === 0 || status === 1"
                    :src="currentPokemon.evolution.image"
                    :alt="currentPokemon.evolution.name"
                    class="pokemon-img"
                    :class="{ 'evolution-progress': (status === 0), shrink: (!showEvolution && status === 0 ) }" />
            </div>
            <progress
                v-if="status === 0"
                :value="currentTime"
                :max="500"
                class="timer" />
            <p class="message">
                {{ currentMessage }}
            </p>
        </template>

        <template
            #actions>
            <button
                v-if="status === 0"
                class="cancel"
                @click="handleStopEvolution">
                Stop
            </button>
            <button
                v-else
                class="confirm"
                @click="removeFirstPokemon">
                OK
            </button>
        </template>

    </pop-up>
</template>

<script>

    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapActions } from 'vuex'

    import { getRandomFromList } from '@/js/mixins/randomGenerator'

    export default {
        name: 'evolution-pop-up',

        components: {
            PopUp
        },

        props: {
            pokemonList: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                evolutionList: [],
                interval: null,
                currentTime: 500,
                status: 0,
                showEvolution: false
            }
        },

        computed: {
            currentPokemon() {
                return this.evolutionList[0]
            },

            currentMessage() {
                if (this.status === 0)
                    return `Your ${this.currentPokemon.name} is evolving.`
                if (this.status === 1)
                    return `Your ${this.currentPokemon.name} evolved into ${this.currentPokemon.evolution.name}.`
                return `Your ${this.currentPokemon.name} did not evolve`
            }
        },

        watch: {
            currentTime(newTime) {
                if (newTime === 0) {
                    this.status = 1
                    this.evolvePokemon({
                        encounterId: this.currentPokemon.id,
                        evolutionId: this.currentPokemon.evolution.id
                    })
                    clearInterval(this.interval)
                }
            }
        },

        async created() {
            this.pokemonList.forEach(async ({data, possibilities}) => {
                const details = {
                    id: data.encounterId,
                    name: data.name,
                    image: data.image,
                    evolution: await this.getPokemonById(getRandomFromList(possibilities))
                }
                return this.evolutionList.push(details)
            })
        },

        mounted() {
            this.startTimer()
        },

        methods: {
            removeFirstPokemon() {
                this.status = 0
                this.showEvolution = false
                this.evolutionList.shift()
                if (this.evolutionList.length) return this.startTimer()
                this.$emit('completedEvolutions')
            },

            startTimer() {
                this.currentTime = 500
                this.interval = setInterval(() => {
                    --this.currentTime
                    if (!(this.currentTime % 50)) this.showEvolution = !this.showEvolution
                }, 10)
            },

            handleStopEvolution() {
                this.status = 2
                clearInterval(this.interval)
            },

            ...mapActions([
                'getPokemonById',
                'evolvePokemon'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/evolutionPopUp.scss"></style>