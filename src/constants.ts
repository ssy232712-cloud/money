import { ShoppingBag, Coffee, Pizza, Zap, Book, Gift, Home, Laptop, Camera, Heart } from 'lucide-react';

export const PRODUCT_POOL = [
  { name: '초콜릿', minPrice: 1000, maxPrice: 3000, category: '식품', icon: 'ShoppingBag' },
  { name: '아메리카노', minPrice: 1500, maxPrice: 4500, category: '음료', icon: 'Coffee' },
  { name: '피자 조각', minPrice: 3000, maxPrice: 6000, category: '식품', icon: 'Pizza' },
  { name: '건전지', minPrice: 2000, maxPrice: 5000, category: '생활용품', icon: 'Zap' },
  { name: '공책', minPrice: 1000, maxPrice: 3500, category: '문구', icon: 'Book' },
  { name: '색연필 세트', minPrice: 5000, maxPrice: 15000, category: '문구', icon: 'Gift' },
  { name: '우산', minPrice: 8000, maxPrice: 20000, category: '생활용품', icon: 'Home' },
  { name: '마우스', minPrice: 15000, maxPrice: 45000, category: '전자기기', icon: 'Laptop' },
  { name: '필름 카메라', minPrice: 25000, maxPrice: 48000, category: '취미', icon: 'Camera' },
  { name: '장미 한 송이', minPrice: 3000, maxPrice: 7000, category: '꽃', icon: 'Heart' },
  { name: '우유', minPrice: 1000, maxPrice: 2800, category: '식품', icon: 'ShoppingBag' },
  { name: '빵', minPrice: 1200, maxPrice: 4000, category: '식품', icon: 'ShoppingBag' },
  { name: '펜', minPrice: 500, maxPrice: 2000, category: '문구', icon: 'Book' },
  { name: '휴대폰 케이스', minPrice: 10000, maxPrice: 25000, category: '전자기기', icon: 'Laptop' },
  { name: '이어폰', minPrice: 20000, maxPrice: 49000, category: '전자기기', icon: 'Laptop' },
];

export const CATEGORIES = ['전체', '식품', '음료', '생활용품', '문구', '전자기기', '취미', '꽃'];
