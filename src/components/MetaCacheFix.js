import React, { useEffect } from 'react';

const MetaCacheFix = () => {
  useEffect(() => {
    // Prevent browser caching issues
    const addMetaTag = (name, content) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      document.head.appendChild(meta);
      return meta;
    };

    const metaTags = [
      addMetaTag("Cache-Control", "no-cache, no-store, must-revalidate"),
      addMetaTag("Pragma", "no-cache"),
      addMetaTag("Expires", "0")
    ];

    // Add version parameter to scripts and styles to prevent cache
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('?')) {
        link.setAttribute('href', href + '?v=' + Date.now());
      }
    });

    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('?')) {
        script.setAttribute('src', src + '?v=' + Date.now());
      }
    });

    // Clean up on unmount
    return () => {
      metaTags.forEach(meta => {
        if (meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      });
    };
  }, []);

  return null;
};

export default MetaCacheFix;