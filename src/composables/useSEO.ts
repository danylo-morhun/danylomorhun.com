import { onMounted, onUnmounted } from 'vue';

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
}

export function useSEO(options: SEOOptions) {
  const defaultTitle = 'Danylo Morhun - Middle Full-Stack Engineer & Data Engineering Specialist';
  const defaultDescription = 'Middle Full-Stack Engineer & Data Engineering Specialist - Building scalable web applications and data pipelines that process millions of events daily.';
  const defaultImage = 'https://www.danylomorhun.com/img/logo.png';
  const siteUrl = 'https://www.danylomorhun.com';

  const title = options.title ? `${options.title} | Danylo Morhun` : defaultTitle;
  const description = options.description || defaultDescription;
  const image = options.image || defaultImage;
  const url = options.url || siteUrl;
  const type = options.type || 'website';
  const keywords = options.keywords?.join(', ') || 'full-stack engineer, frontend developer, data engineering, Vue.js, TypeScript, Python, web development, portfolio';

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  const updateTitle = () => {
    document.title = title;
  };

  const updateMetaTags = () => {
    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Danylo Morhun');

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'Danylo Morhun Portfolio', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical URL
    updateLinkTag('canonical', url);
  };

  onMounted(() => {
    updateTitle();
    updateMetaTags();
  });

  onUnmounted(() => {
    // Reset to defaults on unmount
    document.title = defaultTitle;
    updateMetaTag('description', defaultDescription);
    updateMetaTag('og:title', defaultTitle, 'property');
    updateMetaTag('og:description', defaultDescription, 'property');
    updateMetaTag('og:url', siteUrl, 'property');
  });
}

