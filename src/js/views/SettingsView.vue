<template>
    <div>
        <div id="settings">
            <navigation-bar
                title="Settings"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="options">
                <label>
                    <span>
                        Sound
                    </span>
                    <toggle-switch v-model="soundStatus" @change="toggleSound" />
                </label>
                <label>
                    <span>
                        Vibrations
                    </span>
                    <toggle-switch v-model="vibrationsStatus" @change="toggleVibrations" />
                </label>
                <label>
                    <span>
                        Full Screen
                    </span>
                    <toggle-switch v-model="fullScreenStatus" @change="toggleFullScreen" />
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import ToggleSwitch from '@/js/components/UI/ToggleSwitch.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
    name: 'settings-view',

        components: {
            NavigationBar,
            ToggleSwitch
        },

        computed: {
            ...mapGetters([
                'soundStatus',
                'vibrationsStatus',
                'fullScreenStatus'
            ])
        },

        created() {
            this.updateAudio('settings-info.mp3')
        },

        methods: {
            ...mapActions([
                'updateAudio',
                'toggleSound'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/settings.scss"></style>