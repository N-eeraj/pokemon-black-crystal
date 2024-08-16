<script setup lang="ts">
const initialLoading = ref(true)

useMeta()
</script>

<template>
  <main>
    <ScreenSplashScreen v-if="initialLoading" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </main>
  <NuxtPwaManifest />
</template>

<style lang="scss">
@use "@styles/display";
@use "@styles/colors";

@import "@styles/transitions.scss";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Nunito Sans', sans-serif;
}

body {
  @include display.flex($justify: center);
  min-height: 100svh;
  background-color: colors.$primary;
  box-sizing: content-box;

  main {
    position: relative;
    width: 100vw;
    height: 100svh;
    background-color: colors.$primary;
    color: colors.$light;

    @media screen and (orientation: landscape) {
      width: unset;
      height: 90vh;
      aspect-ratio: 1/2;
      border: 1px solid colors.$light;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}
</style>
