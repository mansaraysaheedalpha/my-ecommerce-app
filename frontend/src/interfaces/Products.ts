export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  stock?: number;
}

