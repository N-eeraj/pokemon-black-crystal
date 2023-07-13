<template>
    {{ moves }}
</template>

<script>
export default {
    name: 'moves-list',
    props: {
        moves: {
            type: Array,
            required: true
        }
    }
}
</script>