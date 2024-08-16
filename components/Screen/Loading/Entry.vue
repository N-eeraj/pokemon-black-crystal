<script setup lang="ts">
const status = reactive({
  completed: 0,
  total: 14,
})
const progress = computed(() => status.completed * 100 / status.total)

function fetchMoves() {
  const requiredMoveCategories = ['ohko', 'heal', 'damage+heal', 'damage+ailment', 'damage+lower', 'damage+raise', 'damage']
  requiredMoveCategories.forEach(async category => {
    const { data } = await useFetch(`https://pokeapi.co/api/v2/move-category/${category}`)
    status.completed++
    console.log(data.value)
  })
}

async function fetchGrowthRates() {
  for (let id = 1; id < 7; id++) {
    const { data } = await useFetch(`https://pokeapi.co/api/v2/growth-rate/${id}`)
    status.completed++
    console.log(data.value)
  }
}

async function fetchTypes() {
    const { data } = await useFetch('https://pokeapi.co/api/v2/type')
    status.completed++
    console.log(data.value)
}

onMounted(async () => {
  await fetchGrowthRates()
  await fetchTypes()
  fetchMoves()
})
</script>

<template>
  <section class="loading-container">
    <div class="overlay">
      <div class="progress-container">
        <div
          :style="{ width: `${progress}%` }"
          class="progress" />
      </div>

      <small>
        Please wait, loading your game
      </small>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/main";
@use "@styles/display";
@use "@styles/colors";

.loading-container {
  height: 100%;
  background-image: url('/images/loading/entry.webp');
  background-size: cover;
  background-position: center;
  
  .overlay {
    @include main.fullscreen;
    @include display.flex($direction: column, $justify: flex-end, $row: 15px);
    padding-bottom: 25px;
    background-image: linear-gradient(transparent, colors.$primary);

    .progress-container {
      width: 85%;
      height: 10px;
      background-color: rgba(colors.$light, 0.25);
      border-radius: 20px;
      overflow: hidden;

      .progress {
        height: 100%;
        background-color: colors.$accent;
        transition-duration: 400ms;
      }
    }
  }
}
</style>
