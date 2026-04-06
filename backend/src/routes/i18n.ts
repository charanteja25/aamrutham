import { Router, Request, Response } from 'express';
import { translations, languages } from '../data/translations';

export const i18nRoutes = Router();

i18nRoutes.get('/languages', (req: Request, res: Response) => {
  res.json(languages);
});

i18nRoutes.get('/:lang', (req: Request, res: Response) => {
  const { lang } = req.params;
  const translation = translations[lang];
  
  if (!translation) {
    return res.status(404).json({ error: 'Language not found' });
  }
  
  res.json(translation);
});

i18nRoutes.get('/:lang/:namespace', (req: Request, res: Response) => {
  const { lang, namespace } = req.params;
  const translation = translations[lang];
  
  if (!translation) {
    return res.status(404).json({ error: 'Language not found' });
  }
  
  const namespaceTranslation = translation[namespace];
  
  if (!namespaceTranslation) {
    return res.status(404).json({ error: 'Namespace not found' });
  }
  
  res.json(namespaceTranslation);
});