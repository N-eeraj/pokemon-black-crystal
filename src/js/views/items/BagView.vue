<template>
    <div>
        <div id="bag">
            
            <navigation-bar
                title="Bag"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

            <div class="items-list">
                <div
                    v-for="item in bagItemsList"
                    :key="item.id"
                    class="item-container">

                    <img
                        :src="require(`@/assets/images/items${item.image}`)"
                        :alt="item.name"
                        class="item-image" />

                    <div class="item-details">
                        <strong>
                            {{ item.name }}
                        </strong>
                        <span class="description">
                            {{ item.description }}
                        </span>
                    </div>

                    <div class="item-count">
                        {{ item.count }}
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"

    import { mapGetters } from "vuex"


    import items from "@/assets/data/items"

    export default {
        name: 'bag-view',

        components: {
            NavigationBar
        },

        data() {
            return {
                bagItemsList: []
            }
        },

        computed:{
            ...mapGetters([
                'bagItems'
            ])
        },

        created() {
            Object.entries(this.bagItems).forEach(([id, count]) => {
                const { name, description, image } = items.find(item => item.id == id)
                this.bagItemsList.push({
                    id,
                    count,
                    name,
                    description,
                    image
                })
            })
        },

    }
</script>

<style lang="scss" src="@/styles/items/bag.scss"></style>