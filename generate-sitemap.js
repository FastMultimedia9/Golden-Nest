const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { join } = require('path');

// Define your website's base URL
const baseUrl = 'https://fastmultimedia.site';

// *************************************
// CRITICAL: UPDATE THIS LIST WITH YOUR ACTUAL PAGE ROUTES
// *************************************
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 }, // Homepage
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/services/logo-design', changefreq: 'monthly', priority: 0.7 },
  { url: '/services/web-design', changefreq: 'monthly', priority: 0.7 },
  { url: '/services/graphic-design', changefreq: 'monthly', priority: 0.7 },
  { url: '/portfolio', changefreq: 'weekly', priority: 0.9 },
  { url: '/contact', changefreq: 'yearly', priority: 0.6 },
  // Add all other page routes from your website here
];

// Create the sitemap stream
const sitemap = new SitemapStream({ hostname: baseUrl });

// Add each route to the stream
routes.forEach(route => {
  sitemap.write(route);
});

sitemap.end();

// Generate the XML and write it to the public folder
streamToPromise(sitemap)
  .then(xml => {
    const filePath = join(__dirname, 'public', 'sitemap.xml');
    createWriteStream(filePath).write(xml);
    console.log('✅ Sitemap generated successfully at:', filePath);
  })
  .catch(err => {
    console.error('❌ Error generating sitemap:', err);
  });