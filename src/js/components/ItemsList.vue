<template>
    <div id="bag_items">
        <navigation-bar
            :title="title"
            icon="cross-mark"
            @icon-event="$emit('iconEvent')" />

        <div class="items-list">
            <div
                v-for="item in itemsList.filter(item => item.count)"
                :key="item.id"
                class="item-container"
                :class="{ selectable }"
                @click="$emit('selectItem', item.id)">

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
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    export default {
        name: 'items-list',

        components: {
            NavigationBar}
        ,

        props: {
            itemsList: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                required: false
            },
            selectable: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    }
</script>

<style lang="scss" src="@/styles/items/list.scss"></style>