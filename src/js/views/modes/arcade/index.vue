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
                    :key="item.id"
                    @click="$emit('legendaryHunt')">

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
    }

</script>