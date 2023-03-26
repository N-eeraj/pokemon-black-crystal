import { encryptAndSave } from "@/js/mixins/common"
import { moveDamage } from "@/js/mixins/calculations"

let currentAudio

export default {
    updateOfflineStats(state, status) {
        state.isOffline = status
    },

    updateAudio(state, audio) {
        state.audio = audio
        const audioFile = require(`@/assets/audio/${audio}`)
        if (currentAudio)
            currentAudio.pause()
        currentAudio = new Audio(audioFile)
        if (state.gameData)
            currentAudio.muted = !state.gameData.sound
        currentAudio.loop = true
        currentAudio.play()
    },
    
    saveGameData(state, data) {
        state.gameData = data
        encryptAndSave()
    },

    savePlayerInfo(state, playerInfo) {
        state.gameData.playerInfo = playerInfo
        encryptAndSave()
    },

    toggleSound(state) {
        state.gameData.sound = !state.gameData.sound
        currentAudio.muted = !state.gameData.sound
        encryptAndSave()
    },

    setPokemonData(state, data) {
        state.pokemonData = data
    },

    encounteredNewPokemon(state, count) {
        state.gameData.pokemon.encountered.last += count
        encryptAndSave()
    },

    storePokemonDataByPokemon(state, pokemonData) {
        const {id, ...data} = pokemonData
        state.pokemonData[id] = data
        if (!state.gameData) return
        const encounters = state.gameData.pokemon.encountered
        if (!encounters.list.includes(id))
            encounters.list.push(id)
        encryptAndSave()
    },

    cacheMovesData(state, moveData) {
        const {name, ...data} = moveData
        state.movesData[name] = data
    },

    cacheTypeData(state, typeData) {
        const {name, ...data} = typeData
        state.typesData[name] = data
    },

    cacheGrowthRateData(state, growthRateData) {
        const {name, levels} = growthRateData
        const data = Object.values(levels).map(({experience}) => experience)
        state.growthRateData[name] = data
    },

    rearrangePlayerPokemon(state, { list, currentIndex, newIndex }) {
        const pokemonList = state.gameData.pokemon[list]

        if (newIndex < 0) newIndex = 0
        else if (newIndex >= pokemonList.length) {
            newIndex = pokemonList.length - 1
        }
        
        [pokemonList[currentIndex], pokemonList[newIndex]] = [pokemonList[newIndex], pokemonList[currentIndex]]
        encryptAndSave()
    },

    movePokemon(state, { id, from, to }) {
        const pokemonData = state.gameData.pokemon
        pokemonData[from] = pokemonData[from].filter(caughtId => caughtId !== id)
        pokemonData[to].push(id)
        encryptAndSave()
    },

    releasePokemon(state, { id, list }) {
        const pokemonData = state.gameData.pokemon
        pokemonData[list] = pokemonData[list].filter(caughtId => caughtId !== id)
        encryptAndSave()
    },

    updateBag(state, { itemId, count }) {
        if (state.gameData.progress.bag[itemId]) state.gameData.progress.bag[itemId] += count
        else state.gameData.progress.bag[itemId] = count
        encryptAndSave()
    },

    updatePlayerCoins(state, amount) {
        state.gameData.progress.coins += amount
        encryptAndSave()
    },

    setBattleData(state, data) {
        if(data) data.faintedPokemon = []
        state.battle = data
    },

    reArrangePartyPokemon(state, { currentIndex, newIndex, isOpponent }) {
        const user = state.battle[isOpponent ? 'foe' : 'trainer']

        if (newIndex < 0) newIndex = 0
        else if (newIndex >= user.partyList.length) {
            newIndex = user.partyList.length - 1
        }

        [user.partyList[currentIndex], user.partyList[newIndex]] = [user.partyList[newIndex], user.partyList[currentIndex]]
        
        if (user.currentPokemonIndex === newIndex) user.currentPokemonIndex = currentIndex
        else if (user.currentPokemonIndex === currentIndex) user.currentPokemonIndex = newIndex
    },

    switchBattlePokemon(state, { newIndex, isOpponent }) {
        state.battle[isOpponent ? 'foe' : 'trainer'].currentPokemonIndex = newIndex
    },

    useMoveBattleDataUpdate(state, { moveData, inCommingAttack }) {
        const attacker = state.battle[inCommingAttack ? 'foe' : 'trainer']
        const defender = state.battle[inCommingAttack ? 'trainer' : 'foe']

        const attackingPokemon = attacker.partyList[attacker.currentPokemonIndex]
        const defendingPokemon = defender.partyList[defender.currentPokemonIndex]

        // if move category is ohko set damage as defending pokemon's hp else calculate damage
        const damage = (moveData.category === 'ohko') ? defendingPokemon.currentHp : moveDamage(moveData, attackingPokemon, defendingPokemon)

        // if move category is damage+heal set heal as half of the damage dealt else set use heal from move data as percentage
        let heal
        if (moveData.name === 'self-destruct')
            heal = -attackingPokemon.currentHp
        else if (moveData.category === 'damage+heal')
            heal = Math.ceil(damage / 2)
        else
            heal = defendingPokemon.stat.hp * moveData.healing * 0.01

        defendingPokemon.currentHp -= damage
        attackingPokemon.currentHp += heal
        attackingPokemon.currentHp = Math.min(attackingPokemon.currentHp, attackingPokemon.stat.hp)
        attackingPokemon.movesList.find(move => move.name === moveData.name).pp -= 1
    },

    pokemonFaintedBattleDataUpdate(state, user) {
        const player = state.battle[user]
        const faintedPokemon = player.partyList.splice(player.currentPokemonIndex, 1)[0]
        if (player.partyList.length) player.currentPokemonIndex = 0
        state.battle.faintedPokemon.push({
            encounterId: faintedPokemon.encounterId,
            exp: faintedPokemon.expGained
        })
    },

    addCaughtPokemon(state, { pokemon, exp }) {
        state.gameData.pokemon.caughtList.push(pokemon)
        const pokemonData = state.gameData.pokemon
        pokemonData.caught[pokemonData.encountered.last] = {
            id: pokemon,
            exp: exp,
            happiness: state.pokemonData[pokemon].baseHappiness
        }
        if (pokemonData.party.length < 6)
            pokemonData.party.push(pokemonData.encountered.last)
        else
            pokemonData.pc.push(pokemonData.encountered.last)
        encryptAndSave()
    },

    gainExperience(state, { totalExp, encounterIds }) {
        const sharedExp = Math.floor(totalExp / encounterIds.length)
        encounterIds.forEach(id => {
            state.gameData.pokemon.caught[id].exp += sharedExp
        })
        encryptAndSave()
    },

    updatePokemonHappiness(state, { id, happiness }) {
        const pokemon = state.gameData.pokemon.caught[id]
        pokemon.happiness += happiness
        if (pokemon.happiness < 0)
            pokemon.happiness = 0
        else if (pokemon.happiness > 255)
            pokemon.happiness = 255
        encryptAndSave()
    },

    toggleEvolutionCheck(state) {
        state.checkEvolution = !state.checkEvolution
    },

    evolvePokemon(state, { encounterId, evolutionId }) {
        state.gameData.pokemon.caughtList.push(evolutionId)
        state.gameData.pokemon.caught[encounterId].id = evolutionId
        const encounters = state.gameData.pokemon.encountered
        if (!encounters.list.includes(evolutionId))
            encounters.list.push(evolutionId)
        encryptAndSave()
    },

    levelUp(state) {
        ++state.gameData.progress.level
        encryptAndSave()
    },

    setLevel(state, level) {
        state.gameData.progress.level = level
        encryptAndSave()
    },

    startArcade(state, arcadeEvent) {
        ++state.gameData.progress.arcade[arcadeEvent].attempts
        encryptAndSave()
    },

    winArcade(state, arcadeEvent) {
        ++state.gameData.progress.arcade[arcadeEvent].victories
        encryptAndSave()
    },

    updateCarnivalEntry(state, eventName = null) {
        state.carnivalEntry = eventName
    }
}