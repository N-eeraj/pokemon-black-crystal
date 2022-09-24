<template>
    <div>
    </div>
</template>

<script>
	export default {
		name: 'battle-scene',
		props: {
			playerParty: {
				type: Object,
				required: true
			},
			foeParty: {
				type: Object,
				required: true
			},
			saveBattle: {
				type: Boolean,
				required: false,
				default: false
			}
		},

		mounted() {
			console.log(this.playerParty)
			console.log(this.foeParty)
			console.log(this.saveBattle)
		},
	}
</script>