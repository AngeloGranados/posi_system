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
