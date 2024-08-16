interface MetaDetails {
  title?: string
  description?: string
}

const useMeta = ({ title, description }: MetaDetails = {}): void => {
  const runtimeConfig = useRuntimeConfig()
  const {
    appName,
    appURL,
    appDescription,
  } = runtimeConfig.public

  const faviconPath = '/images/favicon.ico'
  const imagePath = '/images/favicon.png'

  useHead({
    title: title ?? appName,
    link: [
      {
        rel: 'icon',
        href: faviconPath,
      },
    ],
    meta: [
      {
        name: 'title',
        content: title,
      },
      {
        name: 'ogType',
        content: 'website',
      },
      {
        name: 'ogTitle',
        content: title,
      },
      {
        name: 'ogUrl',
        content: appURL,
      },
      {
        name: 'description',
        content: description ?? appDescription,
      },
      {
        name: 'ogDescription',
        content: description ?? appDescription,
      },
      {
        name: 'ogImage',
        content: imagePath,
      },
      {
        hid: 'og-image',
        property: 'og:image',
        content: imagePath,
      },
      {
        name: 'twitterCard',
        content: 'summary_large_image',
      },
    ],
  })
}

export default useMeta
