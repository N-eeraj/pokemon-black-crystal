<template>
    <div id="navigation_bar">
        <img
            v-if="icon"
            :src="require(`@/assets/icons/${icon}.svg`)"
            class="icon"
            @click="$emit('iconEvent')" />
        <h3>
            {{ title }}
        </h3>
        <div class="right-action">
            <slot name="right-action"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'navigation-bar',

        props: {
            title: {
                type: String,
                required: false
            },
            icon: {
                type: String,
                reuired: false,
            }
        }
    }
</script>

<style lang="scss" src="@/styles/UI/navbar.scss"></style>