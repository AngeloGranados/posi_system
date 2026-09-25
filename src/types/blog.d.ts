export type tableThNameBlog = "id" | "title" | "category_id" | "author" | "duration" | "published_at" | "created_at" | "is_published" | "actions"
export type orderByAscDescBlog = Exclude<tableThNameBlog, "actions">;
export type orderByBlog = "byASC" | "byDESC";
export interface templateType {
    type_plantilla: string;
    container_style: string;
    imagen_style: string;
    imagen_content: File | String | null;
    parrafo_style: string;
    parrafo_content: string | null;
}
export interface tableThBlog {
    name: tableThNameBlog;
    value: string;
    className?: string;
}

export interface Blog {
    id?: string;
    title: string;
    slug: string;
    category_id: number;
    blog_category_name?: string;
    duration: number;
    summary: string;
    content: templateType[] | null;
    image_url: File;
    author: string;
    published_at?: string;
    is_published: boolean | number;
    created_at?: string;
    updated_at?: string;
}

