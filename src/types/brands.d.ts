export type tableThNameBrands = "id" | "name" | "slug" | "created_at" | "actions"
export type orderByAscDescBrands = Exclude<tableThNameBrands, "actions">;
export type orderByBrands = "ByASC" | "ByDESC";
export interface tableThBrands {
    name: tableThNameBrands;
    value: string;
    className?: string;
}

export interface Brands {
    id?: number;
    name: string;
    slug: string;
    created_at?: string;
}

