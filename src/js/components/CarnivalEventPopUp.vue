<template>
    <pop-up
        close
        class="game-over-pop-up"
        @close-pop-up="$router.push('/mode/carnival')">
        <template #body>
            <div
                v-if="victory"
                class="prize">
                <img
                    :src="image"
                    :alt="item"
                    class="image" />
                <span
                    v-if="count > 1"
                    class="count">
                    {{ count }}
                </span>
            </div>
            <p class="message">
                {{ text }}
            </p>
        </template>
    </pop-up>
</template>

<script>
    import PopUp from '@/js/components/UI/PopUp.vue'

    export default {
        name: 'carnival-event-pop-up',

        components: {
            PopUp
        },

        props: {
            image: {
                type: String,
                required: true
            },
            item: {
                type: String,
                required: true
            },
            count: {
                type: Number,
                required: false,
                default: 1
            },
            text: {
                type: String,
                required: true
            },
            victory: {
                type: Boolean,
                required: true
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/eventPopUp.scss">
    
</style>