import store from '@/js/store/store'

import { getImage, getSprite } from '@/js/mixins/imageAndSprites'
import { getIdFromUrl } from '@/js/mixins/common'


export const Pokemon = async (id) => {
    function getNextPokemon(evolvesTo) {
        if (getIdFromUrl(evolvesTo.species.url) === id) {
            pokemonEvolutionData = evolvesTo
            return
        }
        evolvesTo.evolves_to.forEach(evolution => getNextPokemon(evolution))
    }

    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => data)
    const pokemonSpeciesData = await fetch(pokemonData.species.url)
        .then(response => response.json())
        .then(data => data)
    let pokemonEvolutionData = await fetch(pokemonSpeciesData.evolution_chain.url)
        .then(response => response.json())
        .then(data => data.chain)

    const data = {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map(type => type.type.name),
        image: getImage(pokemonData.name),
        sprite: getSprite(pokemonData.name),
        height: pokemonData.height / 10,
        weight: pokemonData.weight / 10,
        baseStat: {},
        baseExp: pokemonData.base_experience,
        baseHappiness: pokemonSpeciesData.base_happiness,
        captureRate: pokemonSpeciesData.capture_rate,
        growthRate: pokemonSpeciesData.growth_rate.name,
        isLegendary: pokemonSpeciesData.is_legendary,
        evolution: null
    }

    pokemonData.stats.forEach(stat => data.baseStat[stat.stat.name] = stat.base_stat)

    data.moves = pokemonData.moves
        .filter(move => Object.keys(store.state.movesData).includes(move.move.name) && move.version_group_details[0].level_learned_at)
        .map(move => {
            return {
                name: move.move.name,
                level: move.version_group_details[0].level_learned_at
            }
        })

    getNextPokemon(pokemonEvolutionData)

    const nextEvolutionObj = {
        levelUp: {
            minLevel: null,
            pokemon: []
        },
        happinessUp: {
            minLevel: null,
            pokemon: []
        },
        useItem: [],
        trade: [],
    }
    pokemonEvolutionData.evolves_to.forEach(evolution => {
        const evolvedPokemonId = getIdFromUrl(evolution.species.url)
        if (evolvedPokemonId > 386) return
        evolution.evolution_details.forEach(evolutionObject => {
            switch (evolutionObject.trigger.name) {
                case 'level-up':
                    if (evolutionObject.min_level) {
                        nextEvolutionObj.levelUp.minLevel = evolutionObject.min_level
                        nextEvolutionObj.levelUp.pokemon.push(evolvedPokemonId)
                    }
                    else if (evolutionObject.min_happiness) {
                        nextEvolutionObj.happinessUp.minLevel = evolutionObject.min_happiness
                        nextEvolutionObj.happinessUp.pokemon.push(evolvedPokemonId)
                    }
                        break
                case 'use-item':
                    if (evolutionObject.item.name)
                        nextEvolutionObj.useItem.push({
                            itemName: evolutionObject.item.name,
                            pokemon: evolvedPokemonId
                        })
                        break
                case 'trade':
                    nextEvolutionObj.trade.push(evolvedPokemonId)
                    break
            }
        })
    })
    data.evolution = nextEvolutionObj

    return PokemonObject(data)
}

export const PokemonObject = data => {
    
    return {
        ...data,

        getLevel(currentExp) {
            let level = 0
            const growthRateFromState = store.state.growthRateData
            Object.values(growthRateFromState[this.growthRate]).forEach(exp => {
                if (currentExp >= exp) level++
            })
            return level
        },
    
        getExpByLevel(level) {
            const growthRateFromState = store.state.growthRateData
            return growthRateFromState[this.growthRate][level - 1]
        },
    
        getExpGained(canCatch, user, exp) {
            const level = this.getLevel(exp)
            return Math.round(((!canCatch || user ==='trainer') ? 1.5 : 1) * this.baseExp * level / 7)
        },
    
        getStat(exp) {
            const level = this.getLevel(exp)
            return {
                'hp': Math.round((0.02 * this.baseStat['hp'] * level) + 10 + level, 2),
                'attack': Math.round((0.02 * this.baseStat['attack'] * level) + 5, 2),
                'defense': Math.round((0.02 * this.baseStat['defense'] * level) + 5, 2),
                'special-attack': Math.round((0.02 * this.baseStat['special-attack'] * level) + 5, 2),
                'special-defense': Math.round((0.02 * this.baseStat['special-defense'] * level) + 5, 2),
                'speed': Math.round((0.02 * this.baseStat['speed'] * level) + 5, 2)
            }
        },
    
        getDamageRate(attackType) {
            let rate = 1
            const typesDataFromState = store.state.typesData
            this.types.forEach(type => {
                if (typesDataFromState[type].doubleDamage.includes(attackType)) rate *= 2
                if (typesDataFromState[type].halfDamage.includes(attackType)) rate *= 0.5
                if (typesDataFromState[type].noDamage.includes(attackType)) rate *= 0
            })
            return rate
        },
    
        getMovesByLevel(exp) {
            let filteredMoves = this.moves.filter(move => move.level <= this.getLevel(exp))
            if (!filteredMoves.length) {
                filteredMoves = [{
                    name: 'tackle',
                    level: 1
                }]
            }
            return filteredMoves
        }
    }
}