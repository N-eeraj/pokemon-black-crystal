<template>
    <img
        src="@/assets/icons/options.svg"
        alt="options"
        class="pc-actions"
        @click.stop="$emit('showActions')" />

    <transition name="actions">
        <ul
            v-if="showActions"
            class="actions-container">
            <li
                v-for="(action, index) in actions"
                :key="`action-${index}`"
                class="action"
                @click="action.action">
                {{ action.label }}
            </li>
        </ul>
    </transition>
</template>

<script>
    export default {
        name: 'box-actions',

        props: {
            showActions: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                actions: [
                    {
                        label: 'New Box',
                        action: this.newBox
                    },
                    {
                        label: 'Rename Box',
                        action: this.renameBox
                    },
                    {
                        label: 'Delete Box',
                        action: this.deleteBox
                    }
                ]
            }
        },

        methods: {
            newBox() {
                console.log('newBox')
            },

            renameBox() {
                console.log('renameBox')
            },

            deleteBox() {
                console.log('deleteBox')
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/pc-boxes/boxActions.scss"></style>