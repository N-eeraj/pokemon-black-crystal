<template>
    <div class="move-card">
        <span>
            {{ $filters.toTitleCase(move.name) }}
        </span>

        <span v-if="move.healing > 0">
            Heal:
            {{ move.healing }}%
        </span>
        <span v-else>
            Power:
            {{ move.power || 'KO' }}
        </span>

        <span>
            PP:
            {{ move.pp }}
        </span>

        <span>
            Accuracy:
            {{ move.accuracy }}%
        </span>

        <span>
            Type:
            {{ $filters.toTitleCase(move.type) }}
            <type-icon :type="move.type" />
        </span>
    </div>
</template>

<script>
    import TypeIcon from '@/js/components/TypeIcon.vue'

    export default {
        name: 'move-card',
        components: {
            TypeIcon
        },
        props: {
            move: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style lang="scss" src="@/styles/moveCard.scss"></style>