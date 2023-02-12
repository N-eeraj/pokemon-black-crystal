<template>
    <div>
        <items-list
            v-if="bagItemsList.length"
            :items-list="bagItemsList"
            title="Bag"
            @icon-event="$router.push('/')" />
    </div>
</template>

<script>

    import ItemsList from "@/js/components/ItemsList.vue"

    import { mapGetters } from "vuex"

    import items from "@/assets/data/items"

    export default {
        name: 'bag-view',

        components: {
            ItemsList
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
        }

    }
</script>