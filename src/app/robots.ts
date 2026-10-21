import type { MetadataRoute } from 'next';
import { siteSettings } from '../lib/site-url.ts';
export default function robots(): MetadataRoute.Robots {
  const { url, indexable } = siteSettings();
  return indexable ? { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${url}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
