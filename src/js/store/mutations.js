import { encryptAndSave } from '@/js/mixins/common'
import { moveDamage } from '@/js/mixins/calculations'
import achievements from '@/assets/data/achievements'

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
            currentAudio.muted = !state.gameData.settings.sound
        currentAudio.loop = true
        currentAudio.play()
        let resume = false
        window.addEventListener('blur', () => {
            if (state.gameData && !state.gameData.settings.sound) return
            currentAudio.pause()
            resume = true
        })
        window.addEventListener('focus', () => {
            if (!resume) return
            currentAudio.play()
            resume = false
        })
    },

    saveGameData(state, data) {
        state.gameData = data
        encryptAndSave()
    },

    updateDailyRewards(state, { unixtime: last, streak }) {
        state.gameData.dailyRewards = { streak, last }
        encryptAndSave()
    },

    savePlayerInfo(state, playerInfo) {
        state.gameData.playerInfo = playerInfo
        encryptAndSave()
    },

    toggleSound(state) {
        state.gameData.settings.sound = !state.gameData.settings.sound
        if (currentAudio)
            currentAudio.muted = !state.gameData.settings.sound
        encryptAndSave()
    },

    toggleVibrations(state) {
        state.gameData.settings.vibrations = !state.gameData.settings.vibrations
        encryptAndSave()
    },

    toggleFullScreen(state) {
        state.gameData.settings.fullScreen = !state.gameData.settings.fullScreen
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

    rearrangePlayerPokemon(state, { isParty, box, currentIndex, newIndex }) {
        const pokemonData = state.gameData.pokemon
        const pokemonList = isParty ? pokemonData.party : pokemonData.pc[box]

        if (newIndex < 0) newIndex = 0
        else if (newIndex >= pokemonList.length) {
            newIndex = pokemonList.length - 1
        }
        
        [pokemonList[currentIndex], pokemonList[newIndex]] = [pokemonList[newIndex], pokemonList[currentIndex]]
        encryptAndSave()
    },

    moveToParty(state, pokemon) {
        const pokemonData = state.gameData.pokemon
        for (const [boxName, pokemonList] of Object.entries(pokemonData.pc)) {
            if (!pokemonList.includes(pokemon)) continue
            pokemonData.pc[boxName] = pokemonList.filter(id => id !== pokemon)
            break
        }
        pokemonData.party.push(pokemon)
        encryptAndSave()
    },

    moveToBox(state, { from, box, pokemon }) {
        const pokemonData = state.gameData.pokemon
        if (from === 'party')
            pokemonData.party = pokemonData.party.filter(id => id !== pokemon)
        else {
            for (const [boxName, pokemonList] of Object.entries(pokemonData.pc)) {
                if (!pokemonList.includes(pokemon)) continue
                pokemonData.pc[boxName] = pokemonList.filter(id => id !== pokemon)
                break
            }
        }
        pokemonData.pc[box].push(pokemon)
        encryptAndSave()
    },

    createBox(state, boxName) {
        state.gameData.pokemon.pc[boxName] = []
        encryptAndSave()
    },

    updateBoxName(state, { current, updated }) {
        const pc = state.gameData.pokemon.pc
        pc[updated] = pc[current]
        delete pc[current]
        encryptAndSave()
    },

    deleteBox(state, boxName) {
        delete state.gameData.pokemon.pc[boxName]
        encryptAndSave()
    },

    releasePokemon(state, { id, list }) {
        const removeCaught = caughtId => caughtId !== id

        const pokemonData = state.gameData.pokemon
        if (list === 'pc') {
            for (let [boxName, pokemonList] of Object.entries(pokemonData[list])) {
                if (pokemonList.includes(id)) {
                    pokemonData[list][boxName] = pokemonData[list][boxName].filter(removeCaught)
                    return
                }
            }
        }
        else
            pokemonData[list] = pokemonData[list].filter(removeCaught)
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
        const usedMove = attackingPokemon.movesList.find(move => move.name === moveData.name)
        if (usedMove)
            usedMove.pp -= 1
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
        const pokemonData = state.gameData.pokemon
        const isOldEntry = pokemonData.caughtList.includes(pokemon)
        pokemonData.caughtList.push(pokemon)
        pokemonData.caught[pokemonData.encountered.last] = {
            id: pokemon,
            exp: exp,
            happiness: state.pokemonData[pokemon].baseHappiness
        }
        if (pokemonData.party.length < 6)
            pokemonData.party.push(pokemonData.encountered.last)
        else {
            for (const [boxName, boxList] of Object.entries(pokemonData.pc)) {
                if (boxList.length === 30) continue
                pokemonData.pc[boxName].push(pokemonData.encountered.last)
                break
            }
        }
        encryptAndSave()
        if (isOldEntry) return
        const ownedAchievement = achievements.find(({ id }) => id === 'pokemonOwned').achievements[0]
        const distinctCaughtList = Array.from(new Set(pokemonData.caughtList))
        const nextIndex = ownedAchievement.required
            .indexOf(distinctCaughtList.length)
        if (nextIndex !== -1) {
            const title = ownedAchievement.name
                .replace(/<Count>/gi, Intl.NumberFormat('en-US')
                .format(ownedAchievement.required[nextIndex]))
            const level = (() => {
                switch (nextIndex) {
                    case 0:
                        return 'base'
                    case 1:
                        return 'bronze'
                    case 2:
                        return 'silver'
                    case 3:
                        return 'gold'
                }
            })()
            state.achievementUnlocked = {
                title,
                level,
                badge: ownedAchievement.badge
            }
        }

        let region
        if (pokemon <= 151)
            region = 'kanto'
        else if (pokemon <= 251)
            region = 'johto'
        else
            region = 'hoenn'
        const regionAchievement = achievements
            .find(({ id }) => id === 'region')?.achievements
            .find(({ id }) => id === region)
        const requiredCount = regionAchievement.required[0]
        if (requiredCount === distinctCaughtList.filter(id => {
            switch (region) {
                case 'kanto':
                    return id <= 151
                case 'johto':
                    return id > 151 && id <= 251
                default:
                    return id > 251
            }
        }).length) {
            setTimeout(() => {
                const title = regionAchievement.name
                    .replace(/<Count>/gi, Intl.NumberFormat('en-US')
                    .format(requiredCount))
                state.achievementUnlocked = {
                    title,
                    level: 'gold',
                    badge: regionAchievement.badge
                }
            }, 3000)
        }
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

    updateAchievement(state, { type, item, count }) {
        const before = state.gameData.achievements[type][item]
        state.gameData.achievements[type][item] += count || 1
        encryptAndSave()
        const achievement = achievements
            .find(({ id }) => id === type)?.achievements
            .find(({ id }) => id === item)
        let nextIndex
        for (let i = 0; i < achievement.required.length; i++) {
            if (achievement.required[i] > before) {
                nextIndex = i
                break
            }
        }
        if (achievement.required[nextIndex] > state.gameData.achievements[type][item]) return
        const title = achievement.name
            .replace(/<Count>/gi, Intl.NumberFormat('en-US')
            .format(achievement.required[nextIndex]))
        const level = (() => {
            if (achievement.required.length === 1) return 'gold'
            switch (nextIndex) {
                case 0:
                    return 'base'
                case 1:
                    return 'bronze'
                case 2:
                    return 'silver'
                case 3:
                    return 'gold'
            }
        })()
        state.achievementUnlocked = {
            title,
            level,
            badge: achievement.badge
        }
    },

    updateSafariZoneEntry(state, status) {
        state.safariZoneTicket = status
    },

    updateCarnivalEntry(state, eventName = null) {
        state.carnivalEntry = eventName
    },

    unlockAchievement(state) {
        state.achievementUnlocked = null
    }
}