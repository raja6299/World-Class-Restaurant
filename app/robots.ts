import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://world-class-restaurant.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*', '/cart', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
