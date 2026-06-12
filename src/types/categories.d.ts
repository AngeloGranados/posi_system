export type tableThNameCategories = "id" | "name" | "description" | "image_url" | "parent_id" | "created_at" | "actions"
export type orderByAscDescCategories = Exclude<tableThNameCategories, "actions">;
export type orderByCategories = "ByASC" | "ByDESC";
export interface tableThCategories {
    name: tableThNameCategories;
    value: string;
    className?: string;
}

export interface Categories {
    id?: string;
    name: string;
    slug: string;
    description: string;
    description_seo: string;
    image_url: File;
    parent_id?: string | null;
    parent_name?: string | null;
    created_at?: string;
}

export type typeCategories = "Mains" | "Subcategories" | null;
export interface filterOptions {
    orderField: orderByAscDescCategories;
    orderBy: orderByCategories;
    filterlike: string;
    limit: number;
    page: number;
    parent_id: string;
    typeCategories: typeCategories;
}
