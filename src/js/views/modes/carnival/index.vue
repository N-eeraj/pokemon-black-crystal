<template>
    <div>
        <div id="carnival_home">

            <navigation-bar
                title="Carnival"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="event-container">
                <div
                    v-for="(event, index) in events"
                    :key="index"
                    class="event"
                    :class="{ alternate: index % 2 }"
                    :style="`background-image: ${event.background};`"
                    @click="carnivalTicket(event)">
                    
                    <span class="name">
                        {{ event.name }}
                    </span>

                    <img
                        :src="require(`@/assets/images/carnival${event.image}`)"
                        :alt="event.image"
                        class="image" />
                </div>
            </div>

            <pop-up
                v-if="popUp.show"
                close
                @close-pop-up="resetPopUp">

                <template #body>
                    <div class="entry-fee">
                        <img
                            :src="popUpImage"
                            :alt="popUp.item"
                            class="icon" />
                        <span class="count">
                            {{ popUp.count }}
                        </span>
                    </div>
                    <p class="message">
                        {{ popUpText }}
                    </p>
                </template>

                <template
                    v-if="popUp.canEnter"
                    #actions>
                    <button
                        class="confirm"
                        @click="attendEvent">
                        Yes
                    </button>
                </template>

            </pop-up>

        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapGetters } from 'vuex'

    import carnival from '@/assets/data/carnival'

    export default {
        name: 'carnival-mode',

        components: {
            NavigationBar,
            PopUp
        },

        data() {
            return {
                events: carnival,
                popUp: {
                    show: false,
                    item: null,
                    count: null,
                    event: null,
                    canEnter: null
                }
            }
        },

        computed: {
            popUpText() {
                let item
                switch (this.popUp.item) {
                    case 'coin':
                        item = 'Pokécoin'
                        break
                    case 'berry':
                        item = 'Razz Berry'
                        break
                }
                if (this.popUp.canEnter)
                    return `Entry to this event will cost you ${this.popUp.count} ${item}, would you like to continue ?`
                return `You don't have enough ${item}`
            },

            popUpImage() {
                switch (this.popUp.item) {
                    case 'coin':
                        return require('@/assets/images/coin.svg')
                    case 'berry':
                        return require('@/assets/images/items/razz-berry.webp')
                    default:
                        return null
                }
            },

            ...mapGetters([
                'getCoinAndBerry'
            ])
        },

        methods: {
            carnivalTicket({ route, item, count }) {
                if (!item)
                    return this.$router.push(`/mode/carnival/${route}`)

                if (this.getCoinAndBerry[item] && this.getCoinAndBerry[item] > count)
                    this.popUp.canEnter = true
                else
                    this.popUp.canEnter = false

                this.popUp.event = route
                this.popUp.item = item
                this.popUp.count = count
                this.popUp.show = true
            },

            resetPopUp() {
                this.popUp.show = false
                this.popUp.item = null
                this.popUp.count = null
                this.popUp.event = null
                this.popUp.canEnter = null
            },

            attendEvent() {
                console.log(this.popUp.event)
                this.$router.push(`/mode/carnival/${this.popUp.event}`)
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/main.scss"></style>