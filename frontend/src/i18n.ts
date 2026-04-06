import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Aamrutham',
          home: {
            title: 'Premium Mangoes',
            subtitle: 'Handpicked from the finest orchards',
            shopNow: 'Shop Now',
            whyChoose: 'Why Choose Aamrutham?',
            natural: {
              title: '100% Natural',
              desc: 'Naturally ripened without chemicals',
            },
            delivery: {
              title: 'Fast Delivery',
              desc: 'Delivered fresh to your doorstep',
            },
            quality: {
              title: 'Premium Quality',
              desc: 'Handpicked from best orchards',
            },
          },
          products: {
            title: 'Our Mangoes',
            addToCart: 'Add to Cart',
            added: 'Added!',
          },
          productDetail: {
            notFound: 'Product not found',
            backToProducts: 'Back to Products',
            addToCart: 'Add to Cart',
            added: 'Added to Cart!',
            quantity: 'Quantity',
          },
          cart: {
            title: 'Shopping Cart',
            empty: 'Your cart is empty',
            continueShopping: 'Continue Shopping',
            remove: 'Remove',
            clearCart: 'Clear Cart',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            total: 'Total',
            proceedToCheckout: 'Proceed to Checkout',
          },
          checkout: {
            title: 'Checkout',
            customerInfo: 'Customer Information',
            name: 'Full Name',
            phone: 'Phone Number',
            email: 'Email Address',
            address: 'Delivery Address',
            city: 'City',
            pincode: 'Pincode',
            placeOrder: 'Place Order',
            orderSummary: 'Order Summary',
          },
          orderSuccess: {
            title: 'Order Placed Successfully!',
            message: 'Thank you for your order. You will receive a confirmation email shortly.',
            continueShopping: 'Continue Shopping',
          },
          footer: {
            tagline: 'Premium handpicked mangoes from the finest orchards.',
            quickLinks: 'Quick Links',
            contact: 'Contact',
            email: 'Email: info@aamrutham.com',
            rights: 'All rights reserved.',
          },
          header: {
            home: 'Home',
            products: 'Products',
            cart: 'Cart',
          },
        },
      },
      te: {
        translation: {
          welcome: 'ఆమృతానికి స్వాగతం',
          home: {
            title: 'ప్రీమియం మామిడి పండ్లు',
            subtitle: 'ఉత్తమ తోటల నుండి ఎంపిక చేయబడినవి',
            shopNow: 'ఇప్పుడే కొనండి',
            whyChoose: 'ఆమృతాన్ని ఎందుకు ఎంచుకోవాలి?',
            natural: {
              title: '100% సహజం',
              desc: 'రసాయనాలు లేకుండా సహజంగా పండించబడింది',
            },
            delivery: {
              title: 'వేగవంతమైన డెలివరీ',
              desc: 'మీ ఇంటి వద్దకే తాజాగా డెలివరీ చేయబడుతుంది',
            },
            quality: {
              title: 'ప్రీమియం నాణ్యత',
              desc: 'ఉత్తమ తోటల నుండి ఎంపిక చేయబడింది',
            },
          },
          products: {
            title: 'మా మామిడి పండ్లు',
            addToCart: 'కార్ట్‌లో జోడించండి',
            added: 'జోడించబడింది!',
          },
          productDetail: {
            notFound: 'ఉత్పత్తి కనుగొనబడలేదు',
            backToProducts: 'ఉత్పత్తులకు తిరిగి వెళ్ళండి',
            addToCart: 'కార్ట్‌లో జోడించండి',
            added: 'కార్ట్‌లో జోడించబడింది!',
            quantity: 'పరిమాణం',
          },
          cart: {
            title: 'షాపింగ్ కార్ట్',
            empty: 'మీ కార్ట్ ఖాళీగా ఉంది',
            continueShopping: 'షాపింగ్ కొనసాగించండి',
            remove: 'తొలగించు',
            clearCart: 'కార్ట్ ఖాళీ చేయండి',
            subtotal: 'ఉపమొత్తం',
            shipping: 'షిప్పింగ్',
            total: 'మొత్తం',
            proceedToCheckout: 'చెక్అవుట్ కు వెళ్ళండి',
          },
          checkout: {
            title: 'చెక్అవుట్',
            customerInfo: 'కస్టమర్ సమాచారం',
            name: 'పూర్తి పేరు',
            phone: 'ఫోన్ నంబర్',
            email: 'ఇమెయిల్ చిరునామా',
            address: 'డెలివరీ చిరునామా',
            city: 'నగరం',
            pincode: 'పిన్ కోడ్',
            placeOrder: 'ఆర్డర్ చేయండి',
            orderSummary: 'ఆర్డర్ సారాంశం',
          },
          orderSuccess: {
            title: 'ఆర్డర్ విజయవంతంగా ప్లేస్ చేయబడింది!',
            message: 'మీ ఆర్డర్ కు ధన్యవాదాలు. మీకు త్వరలో ధృవీకరణ ఇమెయిల్ అందుతుంది.',
            continueShopping: 'షాపింగ్ కొనసాగించండి',
          },
          footer: {
            tagline: 'ఉత్తమ తోటల నుండి ప్రీమియం ఎంపిక చేయబడిన మామిడి పండ్లు.',
            quickLinks: 'త్వరిత లింకులు',
            contact: 'సంప్రదింపు',
            email: 'ఇమెయిల్: info@aamrutham.com',
            rights: 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
          },
          header: {
            home: 'హోమ్',
            products: 'ఉత్పత్తులు',
            cart: 'కార్ట్',
          },
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;