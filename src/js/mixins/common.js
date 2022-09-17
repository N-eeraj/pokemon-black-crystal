export default {
	getIdFromUrl(url) {
		return Number(url.split('/').slice(-2, -1)[0])
	}
}