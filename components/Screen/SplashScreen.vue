<script setup lang="ts">
const showGameName = ref(false)
const showSplashScreen = ref(true)

onMounted(() => {
  setTimeout(() => showGameName.value = true, 800)
  setTimeout(() => showSplashScreen.value = false, 3000)
})
</script>

<template>
  <Transition name="fade">
    <section
      v-if="showSplashScreen"
      class="splash-screen-container">
      <TransitionGroup name="fade-zoom-slow">
        <img
          src="/images/pokemon-logo.webp"
          alt="pokemon-logo"
          class="pokemon-logo" />
        <h1
          v-if="showGameName"
          class="title">
          Black Crystal
        </h1>
      </TransitionGroup>
    </section>

    <ScreenLoadingEntry v-else />
  </Transition>
</template>

<style lang="scss" scoped>
@use "@styles/main";
@use "@styles/display";
@use "@styles/colors";
@use "@styles/gradients/text" as gradient-text;

.splash-screen-container {
  @include main.fullscreen;
  @include display.flex($direction: column, $justify: center, $row: 24px);
  background-color: colors.$primary;
  z-index: 1;

  .pokemon-logo {
    width: 80%;
    transition-duration: 500ms;
  }

  .title {
    width: 90%;
    color: colors.$extra-light;
    font-size: 48pt;
    text-align: center;
    line-height: 100%;
    @include gradient-text.animated-gradient-text(("start": #0CA, "end": #0AF));
  }
}
</style>
