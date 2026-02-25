export interface Product {
    id?: number;
    name: string;
    slug: string;
    description_short: string;
    description_long: string;
    image: File;
    images?: File[];
    price: number;
    category_id: number;
    idbrand: number;
    rating?: number;
    reviews?: number;
    stock: number;
    discount?: number;
    is_active?: boolean;
    created_at?: string; 
    updated_at?: string;
}
