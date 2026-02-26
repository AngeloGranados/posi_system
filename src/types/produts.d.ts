export type orderBy = "ByPriceMinToMax" | "ByPriceMaxToMin" | "novedades" | "ByMostSold" | "ByNew" | "ByASC" | "ByDESC" | null
type productThName = "id" | "image" | "name" | "slug" | "price" | "stock" | "description_short" | "discount" | "status" | "actions"
type orderByAscDesc = Exclude<productThName, "actions">
type productThKeyValue = { name: productThName, value: string }
type orderByAscDescParams = (field: orderByAscDesc) => Promise<void>

export type tableThProducts = productThKeyValue[]

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
