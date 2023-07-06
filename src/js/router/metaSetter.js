export const setPageTitle = (metaTitle) => {
    let title = 'Pokémon Black Crystal'
    if (metaTitle)
        title = `${title} | ${metaTitle}`
    document.title = title
}