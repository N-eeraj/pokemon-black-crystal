<template>
    <div>
        <div id="carnival_home">

            <navigation-bar
                title="Carnival"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="event-container">
                <div
                    v-for="({ name, image, background }, index) in events"
                    :key="index"
                    class="event"
                    :style="`background-image: ${background};`">
                    
                    <span class="name">
                        {{ name }}
                    </span>

                    <img
                        :src="require(`@/assets/images/carnival${image}`)"
                        :alt="image"
                        class="image" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    import carnival from '@/assets/data/carnival'

    export default {
        name: 'carnival-mode',

        components: {
            NavigationBar
        },

        data() {
            return {
                events: carnival
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/main.scss"></style>