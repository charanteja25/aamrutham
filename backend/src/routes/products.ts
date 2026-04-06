import { Router, Request, Response } from 'express';
import { products } from '../data/products';

export const productRoutes = Router();

productRoutes.get('/', (req: Request, res: Response) => {
  const lang = req.query.lang as string || 'en';
  const productsWithLang = products.map(product => ({
    ...product,
    displayName: lang === 'te' ? product.nameTe : product.name,
    displayDescription: lang === 'te' ? product.descriptionTe : product.description,
    displayPacks: product.packs.map(pack => ({
      ...pack,
      displayName: lang === 'te' ? pack.nameTe : pack.name
    }))
  }));
  res.json(productsWithLang);
});

productRoutes.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const lang = req.query.lang as string || 'en';
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const productWithLang = {
    ...product,
    displayName: lang === 'te' ? product.nameTe : product.name,
    displayDescription: lang === 'te' ? product.descriptionTe : product.description,
    displayPacks: product.packs.map(pack => ({
      ...pack,
      displayName: lang === 'te' ? pack.nameTe : pack.name
    }))
  };
  
  res.json(productWithLang);
});