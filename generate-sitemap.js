// generate-sitemap.js - UPDATED for your actual routes
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { join } = require('path');

const baseUrl = 'https://fastmultimedia.site';

// Based on YOUR actual 16+ routes from App.js
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.9 },
  { url: '/portfolio', changefreq: 'weekly', priority: 0.9 },
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/blog', changefreq: 'weekly', priority: 0.8 },
  { url: '/resources', changefreq: 'weekly', priority: 0.8 },
  { url: '/resources/training', changefreq: 'monthly', priority: 0.7 },
  { url: '/resources/tutorials', changefreq: 'weekly', priority: 0.7 },
  { url: '/resources/templates', changefreq: 'monthly', priority: 0.7 },
  { url: '/resources/tools', changefreq: 'monthly', priority: 0.7 },
  { url: '/resources/ebooks', changefreq: 'monthly', priority: 0.7 },
  { url: '/resources/affiliates', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'yearly', priority: 0.8 },
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  { url: '/cookies', changefreq: 'yearly', priority: 0.3 },
  // Note: You don't have /services/logo-design etc. in your App.js
  // Those routes don't exist in your current setup
];

// Create the sitemap stream
const sitemap = new SitemapStream({ hostname: baseUrl });

// Add each route to the stream
routes.forEach(route => {
  sitemap.write(route);
});

sitemap.end();

// Generate the XML
streamToPromise(sitemap)
  .then(xml => {
    const filePath = join(__dirname, 'public', 'sitemap.xml');
    createWriteStream(filePath).write(xml);
    console.log('✅ Sitemap generated with', routes.length, 'URLs');
    console.log('📋 Routes included:');
    routes.forEach((route, i) => console.log(`${i+1}. ${route.url}`));
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });