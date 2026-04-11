export type tableThNameProduct = "id" | "name" | "price" | "stock" | "description_short" | "category_name" | "discount" | "is_active" | "actions";
export type orderByAscDescProduct = Exclude<tableThNameProduct, "actions">;
export type orderByProduct = "ByPriceMinToMax" | "ByPriceMaxToMin" | "novedades" | "ByMostSold" | "ByNew" | "ByASC" | "ByDESC" | "byNewEntry" | null;
export interface tableThProduct { 
    name: tableThNameProduct; 
    value: string;
    className?: string;
}

export interface Product {
    id?: string;
    name: string;
    sku: string;
    slug: string;
    description_short: string;
    description_long: string;
    image: File;
    images?: File[];
    price: number;
    category_id: string;
    idbrand: string;
    rating?: number;
    reviews?: number;
    stock: number;
    discount?: number;
    product_attributes?: { key: string; value: string }[];
    is_active?: boolean;
    created_at?: string; 
    updated_at?: string;
    category_name?: string;
    is_new_entry?: boolean;
    details?: string;
}

export interface FilterParams {
    categoryId: string | null;
    filterlike: string;
    orderBy: orderByProduct | null;
    orderField: orderByAscDescProduct | null;
    price_min?: number;
    price_max?: number;
    stock_min?: number;
    stock_max?: number;
    page: number;
    limit: number;
    discount_min?: number;
    discount_max?: number;
    byStatus: "active" | "inactive";
}

export interface ImagesProduct {
    alt_text: string;
    attribute_value: string | null;
    id: string;
    image_url: string;
    product_id: string;
    sort_order: number;
}

export interface ProductAttribute {
    id?: string;
    product_id: string;
    category_attribute_id: string;
    attribute_value: string;
}

export interface CategoryAttribute {
    id? : string;
    category_id: string;
    attribute_name: string;
    attribute_unit?: string;
}