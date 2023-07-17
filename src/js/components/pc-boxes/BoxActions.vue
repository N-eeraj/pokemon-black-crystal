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
        hash="escape"
        class="modal new-box"
        @close-pop-up="closePopUp('newBox')">
        <template #body>
            <input
                v-model="newBoxName"
                placeholder="Enter Box Name"
                class="new-box-input"
                @keyup.enter="saveBox" />
            <transition name="error">
                <small
                    v-if="error.newBox.text"
                    class="new-box-error"
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
</template>

<script>
    import PopUp from '@/js/components/UI/PopUp.vue'

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
                    newBox: false
                },
                newBoxName: null,
                error: {
                    newBox: {
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
                this.error.newBox.animate = true
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
                console.log(this.newBoxName)
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