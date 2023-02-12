<template>
    <div>
        <div id="shop">
            
            <navigation-bar
                title="Shop"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="items-container">
                <div
                    v-for="item in shopItems"
                    :key="item.id"
                    class="shop-item"
                    :class="{ disabled: item.price > playerCoins }"
                    @click="selectItem(item)">

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

            <pop-up
                v-if="selectedItem"
                :close="true"
                class="selected-item"
                @close-pop-up="selectedItem = null">

                <template #title>
                    {{ selectedItem.name }}
                </template>

                <template #body>
                    <div class="quantity-selector">
                        <img
                            src="@/assets/icons/minus.svg"
                            alt="-"
                            class="icons"
                            :class="{ disabled: disableDecrement }"
                            @click="handleDecrement" />

                        <strong class="total-quantity">
                            {{ quantity }}
                        </strong>

                        <img
                            src="@/assets/icons/plus.svg"
                            alt="+"
                            class="icons"
                            :class="{ disabled: disableIncrement }"
                            @click="handleIncrement" />
                    </div>

                    <div class="price-container">
                        <img
                            src="@/assets/images/coin.svg"
                            alt="Coins"
                            class="coin-icon" />
                        <span>
                            {{ selectedItem.price * quantity }}
                        </span>
                    </div>
                </template>

                <template #actions>
                    <button
                        class="confirm"
                        @click="handlePurchase">
                        Purchase
                    </button>
                </template>

            </pop-up>

        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"
    import PopUp from "@/js/components/UI/PopUp.vue"

    import { mapGetters, mapActions } from "vuex"

    import items from "@/assets/data/items"

    export default {
        name: 'shop-view',

        components: {
            NavigationBar,
            PopUp
        },

        data() {
            return {
                shopItems: null,
                selectedItem: null,
                quantity: null
            }
        },

        computed: {
            disableIncrement() {
                return this.selectedItem.price * (this.quantity + 1) > this.playerCoins
            },
            
            disableDecrement() {
                return this.quantity === 1
            },
            
            ...mapGetters([
                'playerCoins'
            ])
        },

        created() {
            this.shopItems = items.sort((first, second) => first.price - second.price)
        },

        methods: {
            selectItem(item) {
                if (item.price > this.playerCoins) return
                this.selectedItem = item
                this.quantity = 1
            },

            handleIncrement() {
                if (this.disableIncrement) return
                this.quantity++
            },

            handleDecrement() {
                if (this.disableDecrement) return
                this.quantity--
            },

            handlePurchase() {
                this.updateBag({
                    itemId: this.selectedItem.id,
                    count: this.quantity
                })
                this.updatePlayerCoins(this.selectedItem.price * this.quantity * -1)
                this.selectedItem = null
            },

            ...mapActions([
                'updateBag',
                'updatePlayerCoins'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/items/shop.scss"></style>