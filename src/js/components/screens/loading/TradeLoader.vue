<template>
    <div>
        <div
            id="trade_loader"
            class="loading-screen">
            
            <navigation-bar
                icon="cross-mark"
                class="nav-bar"
                @iconEvent="$router.push('/')" />
                
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
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue';

    export default {
        name: 'trade-loader',

        components: {
            NavigationBar
        },

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