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
                v-for="(action, index) in possibleActions"
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

    <pop-up
        :show="modal.deleteBox"
        close
        prevent-redirect
        hash="delete-box"
        class="modal"
        @close-pop-up="closePopUp('deleteBox')">
        <template #body>
            <span>
                Are you sure you want to delete this box?
            </span>
        </template>
        <template #actions>
            <button
                class="confirm"
                @click="handleDeleteBox">
                Delete
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
            },
            pokemonList: {
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
                        action: this.confirmDeleteBox
                    }
                ],
                modal: {
                    newBox: false,
                    renameBox: false,
                    deleteBox: false
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

        computed: {
            possibleActions() {
                const possibleActions = [...this.actions]
                if (this.pokemonList.length || this.boxes.length === 1)
                    possibleActions.pop()
                return possibleActions
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

            validateBoxName(location, boxName) {
                this.error[location].text = null
                this.error[location].animate = false
                if (!boxName)
                    this.displayError(location, 'Enter a box name')
                else if (this.boxes.find(box => box.toLowerCase() === boxName.trim().toLowerCase()))
                    this.displayError(location, 'Box with this name exists')
                else
                    return true
            },

            newBox() {
                this.newBoxName = ''
                this.modal.newBox = true
            },

            saveBox() {
                if (!this.validateBoxName('newBox', this.newBoxName)) return
                this.createBox(this.newBoxName.trim())
                this.closePopUp('newBox')
            },

            renameBox() {
                this.renameBoxName = this.currentBox
                this.modal.renameBox = true
            },

            updateBox() {
                if (!this.validateBoxName('renameBox', this.renameBoxName)) return
                this.updateBoxName({
                    current: this.currentBox,
                    updated: this.renameBoxName
                })
                this.$emit('rename', this.renameBoxName)
                this.closePopUp('renameBox')
            },

            confirmDeleteBox() {
                this.modal.deleteBox = true
            },

            handleDeleteBox() {
                this.deleteBox(this.currentBox)
                this.closePopUp('deleteBox')
                this.$emit('delete')
            },

            ...mapActions([
                'createBox',
                'updateBoxName',
                'deleteBox',
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/pc-boxes/boxActions.scss"></style>