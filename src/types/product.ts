export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category_id: number[];
  images: string[];
  stock_quantity: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt?: Date;
}
