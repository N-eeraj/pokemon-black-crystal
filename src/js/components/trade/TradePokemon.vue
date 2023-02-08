<template>
    <div>
        {{ client.name }}
        {{ peer?.name }}
    </div>
</template>

<script>
    export default {
        name: 'trade-pokemon',

        props: {
            client: {
                type: Object,
                required: true
            },
            peer: {
                type: Object,
                required: false
            }
        }
    }
</script>