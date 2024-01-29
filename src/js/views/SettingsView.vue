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
            ...mapGetters(['soundStatus'])
        },

        methods: {
            ...mapActions([
                'toggleSound'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/settings.scss"></style>