<script setup lang="ts">
const formData = reactive({
  email: '',
  password: '',
})
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  const { data, error } = await useFetch('/api/login', {
    method: 'POST',
    body: formData,
  })
  if (error.value) { 
    console.log(error.value?.statusMessage)
  }
  else {
    console.log(data.value)
  }
  isLoading.value = false
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input
      v-model="formData.email"
      type="email" />
    <input
      v-model="formData.password"
      type="password" />
    <button
      type="submit"
      :disabled="isLoading">
      Login
    </button>
  </form>
</template>
