<template>
    <div class="achievements-group">
        <strong>
            {{ title }}
        </strong>
        <div class="achievements-container">
            <achievement
                v-for="({name, badge, required, current}, index) in achievements"
                :name="name"
                :badge="badge"
                :required="required"
                :current="current"
                :key="index" />
        </div>
    </div>
</template>

<script>
    import Achievement from '@/js/components/achievements/Achievement.vue'

    export default {
        name: 'achievements-group',

        components: {
            Achievement
        },

        props: {
            title: {
                type: String,
                required: true
            },
            achievements: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/group.scss"></style>