/** No guessed hostname: an unset URL keeps previews out of the search index. */
export function parseSiteUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || !url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname) || url.hostname.includes(':') || url.hostname === 'localhost' || url.hostname.endsWith('.localhost') || url.port)
    throw new Error('SITE_URL must be a public HTTPS origin without a path, port, credentials, query or fragment.');
  return url.origin;
}
export function siteSettings() {
  const url = parseSiteUrl(process.env.SITE_URL);
  return { url, indexable: !!url && process.env.SITE_INDEXABLE === 'true' };
}
export function siteMetadata(path: string) {
  const { url, indexable } = siteSettings();
  return {
    ...(url ? { metadataBase: new URL(url), alternates: { canonical: path } } : {}),
    openGraph: { siteName: 'VAJRYA', ...(url ? { url: new URL(path, url).href } : {}) },
    robots: { index: indexable, follow: indexable },
  };
}
