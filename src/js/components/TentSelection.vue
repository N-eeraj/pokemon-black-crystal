<template>
    <div>
        
        <div id="tent_selection">

            <navigation-bar
                icon="cross-mark"
                @click="$router.push('/mode/arcade')" />

            <h3 class="title">
                Select 3 Pokéballs
            </h3>

            <div class="pokeballs-container">
                <img
                v-for="index in 6"
                src="@/assets/images/pokeball.png"
                class="pokeball"
                :key="index" />
            </div>

            <button
                class="confirm">
                Continue
            </button>

        </div>
        
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue';

    export default {
        name: 'tent-selection',

        components: {
            NavigationBar
        }
    }

</script>

<style lang="scss" src="@/styles/modes/arcade/tentSelection.scss"></style>