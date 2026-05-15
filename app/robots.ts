import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/(dashboard)/',
          '/admin/',
          '/auth/',
          '/projects/',
          '/settings/',
          '/invite/',
          '/share/',
        ],
      },
    ],
    sitemap: 'https://santier.app/sitemap.xml',
    host: 'https://santier.app',
  }
}
