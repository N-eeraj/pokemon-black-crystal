<template>
    <main class="page_not_found">
        <div>
            <h1>4</h1>
            <img src="@/assets/images/pokeball-icon.png" alt="0" />
            <h1>4</h1>
        </div>

        <section>
            <h2>Page Not Found</h2>
            <p>
                The page you are looking for doesn't exist or has been moved.
            </p>
            <button @click="goHome">
                Go to Home
            </button>
        </section>
    </main>
</template>

<script>
    import { appName } from '@/js/mixins/common'
    import { getStorage } from '@/js/mixins/storage'

    export default {
        name: 'page-not-found',

        methods: {
            goHome() {
                this.$router.push(getStorage(appName) ? '/' : '/welcome')
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/404.scss"></style>