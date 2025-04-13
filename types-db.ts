import { FieldValue, Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  name: string;
  userId: string;
  isLive: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Billboards {
  id: string;
  label: string;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface Announcement {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  qty: number;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  isVeg: boolean;
  isActive: boolean;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface Order {
  id: string;
  isPaid: boolean;
  phone: string;
  orderItems: Product[];
  address: string;
  order_status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
