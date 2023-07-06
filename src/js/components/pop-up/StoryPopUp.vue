<template>
    <pop-up
        :show="show"
        class="battle-end-modal">
        <template #body>
            <span class="message">
                You defeated {{ foeName }}
            </span>
            <div class="coins">
                <img
                src="@/assets/images/coin.svg"
                alt="Pokécoins"
                class="image" />
                <span>
                    {{ coins }}
                </span>
            </div>
        </template>
        <template #actions>
            <button
                class="confirm"
                @click="$emit('ok')">
                Ok
            </button>
        </template>
    </pop-up>
</template>

<script>
    import PopUp from '@/js/components/UI/PopUp.vue'

    export default {
        name: 'story-pop-up',
        components: {
            PopUp
        },

        props: {
            show: {
                type: Boolean,
                required: true
            },
            foeName: {
                type: String,
                required: true
            },
            coins: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/modes/story.scss"></style>