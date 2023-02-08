<template>
    <div
        id="trade_loader"
        class="loading-screen">
            
        <div class="overlay">
            
            <span class="message">
                {{ loadingText }}
            </span>

            <button
                v-if="canInvite"
                class="invite-button"
                @click="$emit('shareLink')">
                Invite Friend
            </button>

        </div>

    </div>
</template>

<script>
    export default {
        name: 'trade-loader',

        props: {
            loadingText: {
                type: String,
                required: true
            },
            canInvite: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss" src="@/styles/screens/loading/fullScreenLoader.scss"></style>