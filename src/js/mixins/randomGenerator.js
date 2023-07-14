import foeTrainers from '@/assets/data/foe-trainers'

export const getRandomMove = (pokemon) => {
    const moves = pokemon.movesList.filter(move => move.pp)
    return moves[Math.floor(Math.random() * moves.length)]
}

export const checkMoveAccuracy = (attack) => Math.random() * 100 < attack.accuracy

export const getInRange = (min, max, isFloat=false) => {
    const random = Math.random() * (max - min) + min
    if (isFloat)
        return random
    return Math.floor(random)
}

export const getRandomFromList = (list) => list[Math.floor(Math.random() * list.length)]

export const getRandomOpponent = async () => {
    const url = 'https://randomuser.me/api'
    const response = await fetch(url)
    const data = await response.json()
    const details = data.results[0]
    const genderFilteredTrainers = foeTrainers.filter(trainer => trainer.gender === details.gender)
    const foeTrainer =  getRandomFromList(genderFilteredTrainers)
    const name = `${foeTrainer.type} ${details.name.first}`
    const image = `characters/foe/trainers/${foeTrainer.image}`
    return { name, image }
}