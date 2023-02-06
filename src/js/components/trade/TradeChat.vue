<template>
    <div
        v-if="openChat"
        id="trade_chat">
        <navigation-bar
            icon="cross-mark"
            @iconEvent="toggleChatVisibility" />
    </div>
    <img
        v-else
        id="trade_chat_fab"
        src="@/assets/icons/chat.svg"
        @click="toggleChatVisibility" />
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue';

    export default {
        name: 'trade-chat',

        components: {
            NavigationBar
        },

        data() {
            return {
                openChat: false
            }
        },

        methods: {
            toggleChatVisibility() {
                this.openChat = !this.openChat
            }
        }
    }
</script>

<style lang="scss" src="@/styles/modes/trade/chat.scss"></style>