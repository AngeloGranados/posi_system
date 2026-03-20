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
    image_url: File;
    parent_id?: string | null;
    parent_name?: string | null;
    created_at?: string;
}

