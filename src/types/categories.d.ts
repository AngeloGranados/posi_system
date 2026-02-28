export type tableThNameCategories = "id" | "name" | "description" | "image_url" | "created_at" | "actions"
export type orderByAscDescCategories = Exclude<tableThNameCategories, "actions">;
export type orderByCategories = "ByASC" | "ByDESC";
export interface tableThCategories {
    name: tableThNameCategories;
    value: string;
    className?: string;
}

export interface Categories {
    id?: number;
    name: string;
    slug: string;
    description: string;
    image_url: File;
    created_at?: string;
}

