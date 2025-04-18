// This file contains type declarations for our components
import React from 'react';

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '../components/product/ProductGrid' {
  const ProductGrid: React.FC;
  export default ProductGrid;
}

declare module '../components/contact/ContactForm' {
  const ContactForm: React.FC;
  export default ContactForm;
}

declare module '../components/footer/Footer' {
  const Footer: React.FC;
  export default Footer;
}
