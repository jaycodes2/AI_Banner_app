// Converted from TypeScript to JavaScript

/**
 * @type {import('../types').Preset[]}
 */
export const presets = [
  {
    id: 'diwali',
    name: 'Diwali Special',
    description: 'Festival of lights celebration',
    config: {
      theme: 'festival',
      products: ['Diyas', 'Sweets', 'Decorations'],
      offer: '50% OFF on All Items',
      colorPalette: ['#FF6B6B', '#FFD700', '#FF8C00']
    }
  },
  {
    id: 'black-friday',
    name: 'Black Friday',
    description: 'Biggest sale of the year',
    config: {
      theme: 'sale',
      products: ['Electronics', 'Fashion', 'Home'],
      offer: 'Up to 80% OFF',
      colorPalette: ['#000000', '#FF3838', '#FFD700']
    }
  },
  {
    id: 'new-year',
    name: 'New Year Launch',
    description: 'Fresh start, new products',
    config: {
      theme: 'luxury',
      products: ['Premium Collection'],
      offer: 'Early Bird 30% OFF',
      colorPalette: ['#8E44AD', '#F39C12', '#2C3E50']
    }
  },
  {
    id: 'summer-sale',
    name: 'Summer Sale',
    description: 'Hot deals for summer',
    config: {
      theme: 'nature',
      products: ['Summer Wear', 'Accessories'],
      offer: 'Buy 2 Get 1 Free',
      colorPalette: ['#27AE60', '#16A085', '#2ECC71']
    }
  }
];