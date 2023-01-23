<template>
    <div>
        {{ pokemonList }}
    </div>
</template>

<script>

    export default {
        name: 'evolution-pop-up',

        props: {
            pokemonList: {
                type: Object,
                required: true
            }
        }
    }

</script>