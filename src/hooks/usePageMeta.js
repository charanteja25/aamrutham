import { useEffect } from 'react';

const DEFAULT_OG_IMAGE = 'https://www.aamrutham.com/assets/Subject.png';

export default function usePageMeta({ title, description, ogImage = DEFAULT_OG_IMAGE }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;

    function setMeta(selector, attr, value) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = attr;
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
      return el;
    }

    const metas = [
      setMeta('meta[name="description"]',         ['name',     'description'],       description),
      setMeta('meta[property="og:title"]',         ['property', 'og:title'],          title),
      setMeta('meta[property="og:description"]',   ['property', 'og:description'],    description),
      setMeta('meta[property="og:image"]',         ['property', 'og:image'],          ogImage),
      setMeta('meta[property="og:type"]',          ['property', 'og:type'],           'website'),
      setMeta('meta[name="twitter:card"]',         ['name',     'twitter:card'],      'summary_large_image'),
      setMeta('meta[name="twitter:title"]',        ['name',     'twitter:title'],     title),
      setMeta('meta[name="twitter:description"]',  ['name',     'twitter:description'], description),
    ];

    return () => {
      document.title = prev;
      metas.forEach(el => el?.removeAttribute('content'));
    };
  }, [title, description, ogImage]);
}
