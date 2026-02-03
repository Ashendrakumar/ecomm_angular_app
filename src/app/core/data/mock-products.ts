import { Product } from '../models/product.model';

/**
 * Mock product data for development
 * In production, this would come from a backend API
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 199.99,
    originalPrice: 249.99,
    brand: 'AudioTech',
    images: ['https://via.placeholder.com/400x400?text=Headphones'],
    inStock: true,
    stockQuantity: 50,
    category: 'Electronics',
    createdAt: '2024-01-15T10:00:00Z',
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 30 },
          { id: 'white', value: 'White', inStock: true, stockQuantity: 20 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with health tracking, GPS, and long battery life.',
    price: 299.99,
    brand: 'TechWear',
    images: ['https://via.placeholder.com/400x400?text=SmartWatch'],
    inStock: true,
    stockQuantity: 25,
    category: 'Electronics',
    createdAt: '2024-02-01T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 'small', value: 'Small (40mm)', inStock: true, stockQuantity: 10 },
          { id: 'large', value: 'Large (44mm)', inStock: true, stockQuantity: 15 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'silver', value: 'Silver', inStock: true, stockQuantity: 12 },
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 13 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Leather Jacket',
    description: 'Genuine leather jacket with classic design and premium craftsmanship.',
    price: 449.99,
    originalPrice: 599.99,
    brand: 'FashionElite',
    images: ['https://via.placeholder.com/400x400?text=Jacket'],
    inStock: true,
    stockQuantity: 15,
    category: 'Fashion',
    createdAt: '2024-01-20T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 's', value: 'Small', inStock: true, stockQuantity: 3 },
          { id: 'm', value: 'Medium', inStock: true, stockQuantity: 5 },
          { id: 'l', value: 'Large', inStock: true, stockQuantity: 4 },
          { id: 'xl', value: 'X-Large', inStock: true, stockQuantity: 3 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'brown', value: 'Brown', inStock: true, stockQuantity: 8 },
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 7 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'Comfortable running shoes with advanced cushioning and breathable material.',
    price: 129.99,
    brand: 'SportMax',
    images: ['https://via.placeholder.com/400x400?text=Shoes'],
    inStock: true,
    stockQuantity: 40,
    category: 'Sports',
    createdAt: '2024-02-10T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: '7', value: '7', inStock: true, stockQuantity: 5 },
          { id: '8', value: '8', inStock: true, stockQuantity: 8 },
          { id: '9', value: '9', inStock: true, stockQuantity: 10 },
          { id: '10', value: '10', inStock: true, stockQuantity: 9 },
          { id: '11', value: '11', inStock: true, stockQuantity: 8 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'blue', value: 'Blue', inStock: true, stockQuantity: 20 },
          { id: 'red', value: 'Red', inStock: true, stockQuantity: 20 }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack with multiple compartments and USB charging port.',
    price: 79.99,
    brand: 'TravelGear',
    images: ['https://via.placeholder.com/400x400?text=Backpack'],
    inStock: true,
    stockQuantity: 60,
    category: 'Accessories',
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 39.99,
    brand: 'TechWear',
    images: ['https://via.placeholder.com/400x400?text=Mouse'],
    inStock: true,
    stockQuantity: 100,
    category: 'Electronics',
    createdAt: '2024-02-05T10:00:00Z',
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 60 },
          { id: 'white', value: 'White', inStock: true, stockQuantity: 40 }
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'Cotton T-Shirt',
    description: 'Soft cotton t-shirt with comfortable fit and modern design.',
    price: 24.99,
    brand: 'FashionElite',
    images: ['https://via.placeholder.com/400x400?text=TShirt'],
    inStock: true,
    stockQuantity: 80,
    category: 'Fashion',
    createdAt: '2024-02-15T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 's', value: 'Small', inStock: true, stockQuantity: 15 },
          { id: 'm', value: 'Medium', inStock: true, stockQuantity: 25 },
          { id: 'l', value: 'Large', inStock: true, stockQuantity: 25 },
          { id: 'xl', value: 'X-Large', inStock: true, stockQuantity: 15 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'white', value: 'White', inStock: true, stockQuantity: 30 },
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 30 },
          { id: 'gray', value: 'Gray', inStock: true, stockQuantity: 20 }
        ]
      }
    ]
  },
  {
    id: '8',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning for comfortable workouts.',
    price: 34.99,
    brand: 'SportMax',
    images: ['https://via.placeholder.com/400x400?text=YogaMat'],
    inStock: true,
    stockQuantity: 45,
    category: 'Sports',
    createdAt: '2024-01-30T10:00:00Z',
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'purple', value: 'Purple', inStock: true, stockQuantity: 20 },
          { id: 'blue', value: 'Blue', inStock: true, stockQuantity: 25 }
        ]
      }
    ]
  },
  {
    id: '9',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and multiple brew sizes.',
    price: 89.99,
    brand: 'HomeEssentials',
    images: ['https://via.placeholder.com/400x400?text=CoffeeMaker'],
    inStock: false,
    stockQuantity: 0,
    category: 'Home',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '10',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    price: 69.99,
    brand: 'AudioTech',
    images: ['https://via.placeholder.com/400x400?text=Speaker'],
    inStock: true,
    stockQuantity: 35,
    category: 'Electronics',
    createdAt: '2024-02-20T10:00:00Z',
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'blue', value: 'Blue', inStock: true, stockQuantity: 18 },
          { id: 'red', value: 'Red', inStock: true, stockQuantity: 17 }
        ]
      }
    ]
  },
  {
    id: '11',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature.',
    price: 49.99,
    brand: 'HomeEssentials',
    images: ['https://via.placeholder.com/400x400?text=Lamp'],
    inStock: true,
    stockQuantity: 55,
    category: 'Home',
    createdAt: '2024-02-12T10:00:00Z'
  },
  {
    id: '12',
    name: 'Gaming Keyboard',
    description: 'Mechanical gaming keyboard with RGB lighting and programmable keys.',
    price: 149.99,
    brand: 'TechWear',
    images: ['https://via.placeholder.com/400x400?text=Keyboard'],
    inStock: true,
    stockQuantity: 20,
    category: 'Electronics',
    createdAt: '2024-02-18T10:00:00Z',
    variants: [
      {
        id: 'switch',
        name: 'Switch Type',
        options: [
          { id: 'red', value: 'Red Switches', inStock: true, stockQuantity: 10 },
          { id: 'blue', value: 'Blue Switches', inStock: true, stockQuantity: 10 }
        ]
      }
    ]
  },
  {
    id: '13',
    name: 'Sunglasses',
    description: 'Polarized sunglasses with UV protection and stylish frame design.',
    price: 89.99,
    brand: 'FashionElite',
    images: ['https://via.placeholder.com/400x400?text=Sunglasses'],
    inStock: true,
    stockQuantity: 30,
    category: 'Accessories',
    createdAt: '2024-02-08T10:00:00Z'
  },
  {
    id: '14',
    name: 'Fitness Tracker',
    description: 'Activity tracker with heart rate monitor and sleep tracking.',
    price: 79.99,
    brand: 'SportMax',
    images: ['https://via.placeholder.com/400x400?text=FitnessTracker'],
    inStock: true,
    stockQuantity: 50,
    category: 'Electronics',
    createdAt: '2024-02-22T10:00:00Z',
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'black', value: 'Black', inStock: true, stockQuantity: 25 },
          { id: 'pink', value: 'Pink', inStock: true, stockQuantity: 25 }
        ]
      }
    ]
  },
  {
    id: '15',
    name: 'Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
    price: 29.99,
    brand: 'TravelGear',
    images: ['https://via.placeholder.com/400x400?text=WaterBottle'],
    inStock: true,
    stockQuantity: 70,
    category: 'Accessories',
    createdAt: '2024-02-14T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: '500ml', value: '500ml', inStock: true, stockQuantity: 35 },
          { id: '750ml', value: '750ml', inStock: true, stockQuantity: 35 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'blue', value: 'Blue', inStock: true, stockQuantity: 35 },
          { id: 'green', value: 'Green', inStock: true, stockQuantity: 35 }
        ]
      }
    ]
  },
  {
    id: '16',
    name: 'Phone Case',
    description: 'Protective phone case with shock absorption and clear design.',
    price: 19.99,
    brand: 'TechWear',
    images: ['https://via.placeholder.com/400x400?text=PhoneCase'],
    inStock: true,
    stockQuantity: 90,
    category: 'Accessories',
    createdAt: '2024-02-16T10:00:00Z'
  },
  {
    id: '17',
    name: 'Jeans',
    description: 'Classic fit jeans with stretch fabric and modern wash.',
    price: 59.99,
    brand: 'FashionElite',
    images: ['https://via.placeholder.com/400x400?text=Jeans'],
    inStock: true,
    stockQuantity: 40,
    category: 'Fashion',
    createdAt: '2024-02-11T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: '28', value: '28', inStock: true, stockQuantity: 5 },
          { id: '30', value: '30', inStock: true, stockQuantity: 8 },
          { id: '32', value: '32', inStock: true, stockQuantity: 10 },
          { id: '34', value: '34', inStock: true, stockQuantity: 9 },
          { id: '36', value: '36', inStock: true, stockQuantity: 8 }
        ]
      }
    ]
  },
  {
    id: '18',
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells set with multiple weight options.',
    price: 199.99,
    brand: 'SportMax',
    images: ['https://via.placeholder.com/400x400?text=Dumbbells'],
    inStock: true,
    stockQuantity: 15,
    category: 'Sports',
    createdAt: '2024-01-28T10:00:00Z'
  },
  {
    id: '19',
    name: 'Tablet Stand',
    description: 'Adjustable tablet stand with multiple viewing angles.',
    price: 34.99,
    brand: 'HomeEssentials',
    images: ['https://via.placeholder.com/400x400?text=TabletStand'],
    inStock: true,
    stockQuantity: 40,
    category: 'Accessories',
    createdAt: '2024-02-19T10:00:00Z'
  },
  {
    id: '20',
    name: 'Hoodie',
    description: 'Comfortable hoodie with soft fabric and adjustable hood.',
    price: 44.99,
    brand: 'FashionElite',
    images: ['https://via.placeholder.com/400x400?text=Hoodie'],
    inStock: true,
    stockQuantity: 50,
    category: 'Fashion',
    createdAt: '2024-02-13T10:00:00Z',
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: [
          { id: 's', value: 'Small', inStock: true, stockQuantity: 10 },
          { id: 'm', value: 'Medium', inStock: true, stockQuantity: 15 },
          { id: 'l', value: 'Large', inStock: true, stockQuantity: 15 },
          { id: 'xl', value: 'X-Large', inStock: true, stockQuantity: 10 }
        ]
      },
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'gray', value: 'Gray', inStock: true, stockQuantity: 25 },
          { id: 'navy', value: 'Navy', inStock: true, stockQuantity: 25 }
        ]
      }
    ]
  }
];
