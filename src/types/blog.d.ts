export type tableThNameBlog = "id" | "title" | "category_id" | "author" | "duration" | "published_at" | "created_at" | "is_published" | "actions"
export type orderByAscDescBlog = Exclude<tableThNameBlog, "actions">;
export type orderByBlog = "byASC" | "byDESC";
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
    content: string;
    image_url: File;
    author: string;
    published_at?: string;
    is_published: boolean | number;
    created_at?: string;
    updated_at?: string;
}

