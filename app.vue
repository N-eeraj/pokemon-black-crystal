<script setup lang="ts">
useMeta()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NuxtPwaManifest />
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>
