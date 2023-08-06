const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: process.env.NODE_ENV === 'production' ? '/pokemon-black-crystal/' : '/',
	pwa: {
		name: 'Pokémon Black Crystal',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		manifestOptions: {
			short_name: 'Pokémon Black Crystal',
			start_url: 'https://n-eeraj.github.io/pokemon-black-crystal',
			theme_color: '#111',
			background_color: "#111",
			display: "fullscreen",
			orientation: "portrait",
			display: 'fullscreen',
		}
	},
	devServer: {
		https: true
	}
})