import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseSiteUrl,siteMetadata} from '../../src/lib/site-url.ts';
import sitemap from '../../src/app/sitemap.ts';
import robots from '../../src/app/robots.ts';
test('production origin rejects unsafe/malformed values without guessing a host',()=>{
 assert.equal(parseSiteUrl(undefined),undefined);assert.equal(parseSiteUrl(' '),undefined);
 assert.equal(parseSiteUrl('https://seo-test.example/'),'https://seo-test.example');
 for(const input of ['http://seo-test.example','https://localhost','https://127.0.0.1','https://[::1]','https://user:pass@seo-test.example','https://seo-test.example/path','https://seo-test.example?q=a','https://seo-test.example/#hash','invalid']) assert.throws(()=>parseSiteUrl(input));
});
test('SEO stays noindex without explicit production opt-in; configured sitemap covers 112 real pages',()=>{
 const oldUrl=process.env.SITE_URL,oldIndex=process.env.SITE_INDEXABLE;
 try{
  delete process.env.SITE_URL;delete process.env.SITE_INDEXABLE;
  assert.deepEqual(sitemap(),[]);assert.equal(robots().rules.disallow,'/');
  assert.equal(siteMetadata('/').robots.index,false);assert.equal(siteMetadata('/').alternates,undefined);
  process.env.SITE_URL='https://seo-test.example';
  assert.equal(siteMetadata('/').robots.index,false);assert.deepEqual(sitemap(),[]);
  process.env.SITE_INDEXABLE='true';
  const urls=sitemap().map(entry=>entry.url);assert.equal(urls.length,112);assert.equal(new Set(urls).size,112);
  assert.ok(urls.includes('https://seo-test.example/calculators/tdee'));assert.ok(urls.includes('https://seo-test.example/exercises/goblet-squat'));
  assert.ok(!urls.some(url=>url.includes('/api/')));
  assert.equal(robots().sitemap,'https://seo-test.example/sitemap.xml');assert.equal(robots().rules.disallow,'/api/');
  const metadata=siteMetadata('/calculators/tdee');assert.equal(metadata.alternates.canonical,'/calculators/tdee');assert.equal(metadata.openGraph.url,'https://seo-test.example/calculators/tdee');
 }finally{if(oldUrl===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=oldUrl;if(oldIndex===undefined)delete process.env.SITE_INDEXABLE;else process.env.SITE_INDEXABLE=oldIndex;}
});
