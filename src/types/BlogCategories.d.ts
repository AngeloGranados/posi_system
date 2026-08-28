export type tableThNameBlogCategories = "id" | "name" |"slug" |"description" | "created_at" | "actions"
export type orderByAscDescBlogCategories = Exclude<tableThNameBlogCategories, "actions">;
export type orderByBlogCategories = "ByASC" | "ByDESC";
export interface tableThBlogCategories {
    name: tableThNameBlogCategories;
    value: string;
    className?: string;
}

export interface BlogCategories {
    id?: string;
    name: string;
    slug: string;
    description: string;
    created_at?: string;
}

export interface filterOptions {
    orderField: orderByAscDescBlogCategories;
    orderBy: orderByBlogCategories;
    filterlike: string;
    limit: number;
    page: number;
    parent_id: string;
    typeBlogCategories: typeBlogCategories;
}
