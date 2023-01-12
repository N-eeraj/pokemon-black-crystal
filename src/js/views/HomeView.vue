<template>
    <div>
        <div
            class="home-container"
            :class="{ 'edit-view': editView }"
            :style="`background-image: url(${characterImage});`"
            @click="editPlayer">

            <div
                v-show="editView"
                class="edit-container">
                <div class="edit-nav">
                    <img
                        :src="require(`@/assets/icons/cross-mark.svg`)"
                        class="icon"
                        @click.stop="closeEdit" />
                    <button
                        v-if="player.name"
                        class="save-btn"
                        @click.stop="submitPlayerInfo">
                        Save
                    </button>
                </div>
                <input
                    v-model="player.name"
                    placeholder="Your Name"
                    class="player-name" />

                <div class="avatar-controller-container">
                    <img
                        src="@/assets/icons/previous.svg"
                        alt="Previous"
                        class="change-avatar-icon"
                        @click="previousAvatar">
                    <img
                        src="@/assets/icons/next.svg"
                        alt="Next"
                        class="change-avatar-icon"
                        @click="nextAvatar">
                </div>
            </div>

            <div class="home-icons-container">
                <img
                    src="@/assets/images/home-icons/pokedex.svg"
                    alt="Pokedex">
                <img
                    src="@/assets/images/home-icons/badges.svg"
                    alt="Gym Badges">
                <img
                    src="@/assets/images/home-icons/achievements.svg"
                    alt="Achievements">
            </div>

            <div class="home-icons-container">
                <img
                    src="@/assets/images/home-icons/party.svg"
                    alt="Party Pokemon">
                <img
                    src="@/assets/images/home-icons/pc.svg"
                    alt="PC Pokemon">
            </div>

            <button
                class="main-menu-btn"
                :class="{ open: openMenu }"
                @click.stop="toggleMenu">
                <span></span>
            </button>

        </div>
    </div>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: "home-view",

        data() {
            return {
                openMenu: false,
                editView: false,
                player: {
                    name: '',
                    avatar: null
                }
            }
        },

        computed: {
            characterImage() {
                let avatarId = this.getPlayerInfo.avatar
                if (this.editView) avatarId = this.player.avatar
                return require(`@/assets/images/characters/main-character/character-${avatarId}.gif`)
            },

            ...mapGetters([
                'getPlayerInfo'
            ])
        },

        methods: {
            toggleMenu() {
                this.openMenu = !this.openMenu
            },

            editPlayer() {
                if (this.editView) return
                this.editView = true
                this.player.name = this.getPlayerInfo.name
                this.player.avatar = this.getPlayerInfo.avatar
            },

            closeEdit() {
                this.openMenu = false
                this.editView = false
            },

            previousAvatar() {
                if (this.player.avatar === 0) this.player.avatar = 3
                else this.player.avatar -= 1
            },
            nextAvatar() {
                if (this.player.avatar === 3) this.player.avatar = 0
                else this.player.avatar += 1
            },

            submitPlayerInfo() {
                this.savePlayerInfo(this.player)
                this.closeEdit()
            },

            ...mapActions([
                'savePlayerInfo'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home.scss"></style>