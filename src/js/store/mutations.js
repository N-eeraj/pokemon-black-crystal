import { encryptAndSave } from "@/js/mixins/common"
import { moveDamage } from "@/js/mixins/calculations"

export default {
    updateOfflineStats(state, status) {
        state.isOffline = status
    },
    
    saveGameData(state, data) {
        state.gameData = data
        encryptAndSave(data)
    },

    savePlayerInfo(state, playerInfo) {
        state.gameData.playerInfo = playerInfo
        encryptAndSave(state.gameData)
    },

    toggleSound(state) {
        state.gameData.sound = !state.gameData.sound
        encryptAndSave(state.gameData)
    },

    cachePokemonData(state, pokemonData) {
        const {id, ...data} = pokemonData
        state.pokemonData[id] = data
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
        encryptAndSave(state.gameData)
    },

    movePokemon(state, { id, from, to }) {
        const pokemonData = state.gameData.pokemon
        pokemonData[from] = pokemonData[from].filter(caughtId => caughtId !== id)
        pokemonData[to].push(id)
        encryptAndSave(state.gameData)
    },

    releasePokemon(state, { id, list }) {
        const pokemonData = state.gameData.pokemon
        pokemonData[list] = pokemonData[list].filter(caughtId => caughtId !== id)
        encryptAndSave(state.gameData)
    },

    updateBag(state, { itemId, count }) {
        if (state.gameData.progress.bag[itemId]) state.gameData.progress.bag[itemId] += count
        else state.gameData.progress.bag[itemId] = count
        encryptAndSave(state.gameData)
    },

    updatePlayerCoins(state, amount) {
        state.gameData.progress.coins += amount
        encryptAndSave(state.gameData)
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
        if (moveData.category === 'damage+heal') heal = Math.ceil(moveData.healing / 2)
        else heal = defendingPokemon.stat.hp * moveData.healing * 0.01

        defendingPokemon.currentHp -= damage
        attackingPokemon.currentHp += heal
        attackingPokemon.currentHp = Math.min(attackingPokemon.currentHp, attackingPokemon.stat.hp)
        attackingPokemon.movesList.find(move => move.name === moveData.name).pp -= 1
    },

    pokemonFaintedBattleDataUpdate(state, user) {
        const player = state.battle[user]
        const faintedPokemon = player.partyList.splice(player.currentPokemonIndex, 1)[0]
        state.battle.faintedPokemon.push({
            encounterId: faintedPokemon.encounterId,
            exp: faintedPokemon.expGained
        })
    },

    enounterNewPokemon(state, id) {
        const encounters = state.gameData.pokemon.encountered
        ++encounters.last
        if (!encounters.list.includes(id))
            encounters.list.push(id)
        encryptAndSave(state.gameData)
    },

    addCaughtPokemon(state, data) {
        const pokemonData = state.gameData.pokemon
        pokemonData.caught[pokemonData.encountered.last] = {
            id: data.pokemon,
            exp: data.exp,
            happiness: state.pokemonData[data.pokemon].baseHappiness
        }
        if (pokemonData.party.length < 6)
            pokemonData.party.push(pokemonData.encountered.last)
        else
            pokemonData.pc.push(pokemonData.encountered.last)
        encryptAndSave(state.gameData)
    },

    gainExperience(state, { totalExp, encounterIds }) {
        const sharedExp = totalExp / encounterIds.length
        encounterIds.forEach(id => {
            state.gameData.pokemon.caught[id].exp += sharedExp
        })
        encryptAndSave(state.gameData)
    },

    updatePokemonHappiness(state, { id, happiness }) {
        const pokemon = state.gameData.pokemon.caught[id]
        pokemon.happiness += happiness
        if (pokemon.happiness < 0)
            pokemon.happiness = 0
        encryptAndSave(state.gameData)
    },

    toggleEvolutionCheck(state) {
        state.checkEvolution = !state.checkEvolution
    }
}