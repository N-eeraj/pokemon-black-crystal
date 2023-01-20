<template>
    <div>
        <div id="shop">
            
            <navigation-bar
                title="Shop"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

            <div class="items-container">
                <div
                    v-for="item in shopItems"
                    :key="item.id"
                    class="shop-item">
                    <img
                        :src="require(`@/assets/images/items${item.image}`)"
                        :alt="item.name"
                        class="item-image" />
                    <div class="price-container">
                        <img
                            src="@/assets/images/coin.svg"
                            alt="Coins"
                            class="coin-icon" />
                        <span>
                            {{ item.price }}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"

    import items from "@/assets/data/items"

    export default {
        name: 'shop-view',

        components: {
            NavigationBar
        },

        data() {
            return {
                shopItems: null
            }
        },

        created() {
            this.shopItems = items
        }
    }
</script>

<style lang="scss" src="@/styles/shop.scss"></style>