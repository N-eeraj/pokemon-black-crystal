<template>
    <div
        v-if="openChat"
        id="trade_chat">

        <navigation-bar
            icon="cross-mark"
            @icon-event="toggleChatVisibility" />

        <div class="messages-container">
            <div
                v-for="({ message, client }, index) in messages"
                :key="index"
                class="chat-bubble"
                :class="client ? 'client' : 'peer'">
                {{ message }}
            </div>
        </div>

        <div class="message-input-container">
            <input
                v-model="newMessage"
                placeholder="Enter your message"
                class="input"
                @keydown.enter="sendMessage" />
            <button
                class="send-button"
                @click="sendMessage">
                <img
                    src="@/assets/icons/send.svg"
                    alt="Send"
                    class="icon" />
            </button>
        </div>
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

        props: {
            messages: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                openChat: false,
                newMessage: ''
            }
        },

        methods: {
            toggleChatVisibility() {
                this.openChat = !this.openChat
            },

            sendMessage() {
                if (!this.newMessage) return
                this.$emit('send', this.newMessage)
                this.newMessage = ''
            }
        }
    }
</script>

<style lang="scss" src="@/styles/modes/trade/chat.scss"></style>