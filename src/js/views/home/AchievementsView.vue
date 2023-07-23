<template>
    <div>
        <div id="achievements">
            <navigation-bar
                title="Achievements"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="achievements-list">
                <achievements-group
                    v-for="({title, achievements}, index) in allAchievements"
                    :title="title"
                    :achievements="achievements"
                    :key="index" />
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import AchievementsGroup from '@/js/components/achievements/AchievementsGroup.vue'

    import { mapGetters, mapActions } from 'vuex'

    import achievements from '@/assets/data/achievements'
    import gymLevels from '@/assets/data/gym-levels.json'

    export default {
        name: 'achievements-view',

        components: {
            NavigationBar,
            AchievementsGroup
        },

        data() {
            return {
                allAchievements: null
            }
        },

        computed: {
            ...mapGetters([
                'playerAchievements'
            ])
        },

        created() {
            this.allAchievements = achievements
            this.updateAudio('achievements.mp3')
            this.setCurrentArcade()
            this.setCurrentOwnedPokemon()
            this.setCurrentRegion()
            this.setCurrentStory()
            this.setCurrentMultiplayer()
            this.setCurrentCarnival()
        },

        methods: {
            setCurrentArcade() {
                const arcadeAchievements = this.allAchievements.find(({ id }) => id === 'arcade')
                arcadeAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'battle':
                            return event.current = this.playerAchievements.arcade.battle
                        case 'tent':
                            return event.current = this.playerAchievements.arcade.tent
                        case 'tower':
                            return event.current = this.playerAchievements.arcade.tower
                    }
                })
            },

            setCurrentOwnedPokemon() {
                const ownedPokemonAchievements = this.allAchievements.find(({ id }) => id === 'pokemonOwned')
                ownedPokemonAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'owned':
                            return event.current = this.playerAchievements.ownedPokemon
                    }
                })
            },

            setCurrentRegion() {
                const regionalAchievements = this.allAchievements.find(({ id }) => id === 'region')
                regionalAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'kanto':
                            return event.current = this.playerAchievements.region.kanto
                        case 'johto':
                            return event.current = this.playerAchievements.region.johto
                        case 'hoenn':
                            return event.current = this.playerAchievements.region.hoenn
                        case 'pokedex':
                            return event.current = (
                                this.playerAchievements.region.kanto +
                                this.playerAchievements.region.johto +
                                this.playerAchievements.region.hoenn
                            )
                    }
                })
            },

            setCurrentStory() {
                const storyAchievements = this.allAchievements.find(({ id }) => id === 'story')
                storyAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'gymBadges':
                            event.current = 0
                            gymLevels.forEach(({ level }) => {
                                if (level <= this.playerAchievements.currentLevel)
                                    ++event.current
                                else return
                            })
                            break
                        case 'champion':
                            return event.current = Number(this.playerAchievements.currentLevel === 240)
                    }
                })
            },

            setCurrentMultiplayer() {
                const multiplayerAchievements = this.allAchievements.find(({ id }) => id === 'multiplayer')
                multiplayerAchievements.achievements.forEach(event => {
                    switch(event.id) {
                        case 'trade':
                            return event.current = this.playerAchievements.multiplayer.trade
                        case 'pvp':
                            return event.current = this.playerAchievements.multiplayer.pvp
                    }
                })
            },

            setCurrentCarnival() {
                const carnivalAchievements = this.allAchievements.find(({ id }) => id === 'carnival')
                carnivalAchievements.achievements.forEach(event => {
                    switch(event.id) {
                        case 'whosThatPokemon':
                            return event.current = this.playerAchievements.carnival.whosThatPokemon
                        case 'findingDitto':
                            return event.current = this.playerAchievements.carnival.findingDitto
                        case 'berryCrusher':
                            return event.current = this.playerAchievements.carnival.berryCrusher
                        case 'pokemonRoulette':
                            return event.current = this.playerAchievements.carnival.pokemonRoulette
                        case 'pokemonDash':
                            return event.current = this.playerAchievements.carnival.pokemonDash
                        case 'blockSmash':
                            return event.current = this.playerAchievements.carnival.blockSmash
                    }
                })
            },

            ...mapActions([
                'updateAudio'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/main.scss"></style>