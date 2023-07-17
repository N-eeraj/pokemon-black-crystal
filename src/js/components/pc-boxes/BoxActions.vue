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

    <pop-up
        :show="modal.newBox"
        close
        prevent-redirect
        hash="new-box"
        class="modal pc-box"
        @close-pop-up="closePopUp('newBox')">
        <template #body>
            <input
                v-model="newBoxName"
                placeholder="Enter Box Name"
                class="box-input"
                @keyup.enter="saveBox" />
            <transition name="error">
                <small
                    v-if="error.newBox.text"
                    class="box-error"
                    :class="{'error-animation': error.newBox.animate}">
                    {{ error.newBox.text }}
                </small>
            </transition>
        </template>
        <template #actions>
            <button
                class="confirm"
                @click="saveBox">
                Create Box
            </button>
        </template>
    </pop-up>

    <pop-up
        :show="modal.renameBox"
        close
        prevent-redirect
        hash="rename-box"
        class="modal pc-box"
        @close-pop-up="closePopUp('renameBox')">
        <template #body>
            <input
                v-model="renameBoxName"
                placeholder="Enter New Box Name"
                class="box-input"
                @keyup.enter="updateBox" />
            <transition name="error">
                <small
                    v-if="error.renameBox.text"
                    class="box-error"
                    :class="{'error-animation': error.renameBox.animate}">
                    {{ error.renameBox.text }}
                </small>
            </transition>
        </template>
        <template #actions>
            <button
                class="confirm"
                @click="updateBox">
                Rename Box
            </button>
        </template>
    </pop-up>
</template>

<script>

    import PopUp from '@/js/components/UI/PopUp.vue'
    import { mapActions } from 'vuex'

    export default {
        name: 'box-actions',

        components: {
            PopUp
        },

        props: {
            showActions: {
                type: Boolean,
                required: false,
                default: false
            },
            boxes: {
                type: Array,
                required: false,
                default: []
            },
            currentBox: {
                type: String,
                required: false,
                default: 'Box 1'
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
                ],
                modal: {
                    newBox: false,
                    renameBox: false
                },
                newBoxName: null,
                renameBoxName: null,
                error: {
                    newBox: {
                        text: null,
                        animate: null
                    },
                    renameBox: {
                        text: null,
                        animate: null
                    }
                }
            }
        },

        methods: {
            closePopUp(modal) {
                this.modal[modal] = false
            },

            displayError(location, text) {
                this.error[location].text = text
                this.error[location].animate = true
                setTimeout(() => {
                    this.error[location].animate = false
                }, 1000)
            },

            newBox() {
                this.newBoxName = ''
                this.modal.newBox = true
            },

            saveBox() {
                this.error.newBox.text = null
                this.error.newBox.animate = false
                if (!this.newBoxName)
                    return this.displayError('newBox', 'Enter a box name')
                if (this.boxes.find(box => box.toLowerCase() === this.newBoxName.trim().toLowerCase()))
                    return this.displayError('newBox', 'Box with this name exists')
                this.createBox(this.newBoxName.trim())
                this.closePopUp('newBox')
            },

            renameBox() {
                this.renameBoxName = this.currentBox
                this.modal.renameBox = true
            },

            updateBox() {
                this.error.renameBox.text = null
                this.error.renameBox.animate = false
                if (!this.renameBoxName)
                    return this.displayError('renameBox', 'Enter a box name')
                if (this.boxes.find(box => box.toLowerCase() === this.renameBoxName.trim().toLowerCase()))
                    return this.displayError('renameBox', 'Box with this name exists')
                this.updateBoxName({
                    current: this.currentBox,
                    updated: this.renameBoxName
                })
                this.$emit('renamed', this.renameBoxName)
                this.closePopUp('renameBox')
            },

            deleteBox() {
                console.log('deleteBox')
            },

            ...mapActions([
                'createBox',
                'updateBoxName',
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/pc-boxes/boxActions.scss"></style>