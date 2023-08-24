export const shareLink = async ({ url, text }) => {
    if (navigator.share) {
        const shareData = {
            title: 'Pokémon Black Crystal',
            text,
            url
        }
        await navigator.share(shareData)
    }
    else {
        const dummy = document.createElement('textarea')
        document.body.appendChild(dummy)
        dummy.value = location.origin + url
        dummy.select()
        document.execCommand('copy')
        document.body.removeChild(dummy)
        alert('Copied Invitation Link')
    }
}