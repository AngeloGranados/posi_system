import { Blog, orderByAscDescBlog, orderByBlog } from "@/types/blog";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}blogs`;

interface filterOptions {
    orderField: orderByAscDescBlog;
    orderBy: orderByBlog;
    limit: number;
    page: number;
}

export async function getBlog(): Promise<Blog[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteBlog(blogId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${blogId}`, {
        method: "DELETE",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateBlog(blog: Blog): Promise<Blog> {

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("slug", blog.slug);
    formData.append("category_id", blog.category_id.toString());
    formData.append("author", blog.author);
    formData.append("duration", blog.duration.toString());
    formData.append("summary", blog.summary);
    formData.append("content", blog.content);
    formData.append("published_at", blog.published_at || new Date().toISOString());
    formData.append("is_published", blog.is_published ? "true" : "false");
    formData.append("image_url", blog.image_url);

    const response = await fetch(`${URL_API}/${blog.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createBlog(blog: Blog): Promise<Blog> {

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("slug", blog.slug);
    formData.append("category_id", blog.category_id.toString());
    formData.append("duration", blog.duration.toString());
    formData.append("author", blog.author);
    formData.append("summary", blog.summary);
    formData.append("content", blog.content);
    formData.append("published_at", blog.published_at || new Date().toISOString());
    formData.append("is_published", blog.is_published ? "true" : "false");
    formData.append("image_url", blog.image_url);

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getBlogFiltered(filterOptions: filterOptions): Promise<{ data: Blog[]; total: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.orderBy){
        switch (filterOptions.orderBy) {
            case "byASC":
            case "byDESC":
                if (filterOptions.orderField) {
                    params.append(filterOptions.orderBy, filterOptions.orderField);
                }
        }
    }

    const response = await fetch(`${URL_API}/filter?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
