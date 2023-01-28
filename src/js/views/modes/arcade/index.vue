<template>
    <div>
        <div id="arcade_home">

            <navigation-bar
                title="Arcade"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

            <div class="arcade-items-container">

                <banner-card
                    v-for="item in arcade"
                    :image="`images/arcade/${item.image}`"
                    :title="item.title"
                    overlay="linear-gradient(90deg, #0AF, #FFF7)"
                    class="arcade-card"
                    :key="item.id"
                    @click="handleArcadeItem(item.id)">

                    <p class="description">
                        {{ item.description }}
                    </p>

                </banner-card>

            </div>

        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import BannerCard from '@/js/components/UI/BannerCard.vue'

    import arcade from '@/assets/data/arcade.json'

    export default {
        name: 'arcade-mode',

        components: {
            NavigationBar,
            BannerCard
        },

        data() {
            return {
                arcade
            }
        },

        methods: {
            handleArcadeItem(id) {
                switch (id) {
                    case 1:
                        this.$router.push('/mode/arcade/battle')
                        break
                    case 2:
                        this.$router.push('/mode/arcade/tent/selection')
                        break
                    case 3:
                        this.$router.push('/mode/arcade/tower')
                        break
                }
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/arcade/main.scss"></style>