export type tableThNameProduct = "id" | "name" | "price" | "stock" | "description_short" | "discount" | "is_active" | "actions";
export type orderByAscDescProduct = Exclude<tableThNameProduct, "actions">;
export type orderByProduct = "ByPriceMinToMax" | "ByPriceMaxToMin" | "novedades" | "ByMostSold" | "ByNew" | "ByASC" | "ByDESC" | null;
export interface tableThProduct { 
    name: tableThNameProduct; 
    value: string;
    className?: string;
}

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
    product_attributes?: { key: string; value: string }[];
    is_active?: boolean;
    created_at?: string; 
    updated_at?: string;
}

export interface ImagesProduct {
    alt_text: string;
    attribute_value: string | null;
    id: number;
    image_url: string;
    product_id: number;
    sort_order: number;
}

export interface ProductAttribute {
    id?: number;
    product_id: number;
    category_attribute_id: number;
    attribute_value: string;
}

export interface CategoryAttribute {
    id? : number;
    category_id: number;
    attribute_name: string;
    attribute_unit?: string;
}