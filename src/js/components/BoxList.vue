<template>
    <div class="box-list">
        {{ box }}
    </div>
</template>

<script>
    export default {
        name: 'box-list',
        props: {
            box: {
                type: String,
                required: true
            }
        }
    }
</script>