export type tableThNameBrands = "id" | "name" | "label" | "description" | "created_at" | "actions"
export type orderByAscDescBrands = Exclude<tableThNameBrands, "actions">;
export type orderByBrands = "ByASC" | "ByDESC";
export interface tableThBrands {
    name: tableThNameBrands;
    value: string;
    className?: string;
}

export interface Brands {
    id?: string;
    name: string;
    image_url: File;
    label: string;
    description: string;
    slug: string;
    created_at?: string;
}

