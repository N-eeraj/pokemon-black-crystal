<script setup lang="ts">
const { data, status } = useFetch('/api/test')
</script>

<template>
  <span v-if="status === 'pending'">
    Loading
  </span>
  <span>
    {{ data }}
  </span>
</template>
