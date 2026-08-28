import { BlogCategories, filterOptions } from "@/types/BlogCategories";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}blog_categories`;

export async function getBlogCategories(): Promise<{ data: BlogCategories[] }> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteBlogCategory(BlogCategoryId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${BlogCategoryId}`, {
        method: "DELETE",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function changeStatusBlogCategory(id: string, newStatus: boolean): Promise<{ success: boolean }> {
    const response = await fetch(`${URL_API}/changeStatus/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ newStatus })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || "Error changing BlogCategory status");
    }
    return data;
}

export async function updateBlogCategory(BlogCategory: BlogCategories): Promise<BlogCategories> {

    const Formdata = {
        name: BlogCategory.name,
        slug: BlogCategory.slug,
        description: BlogCategory.description
    }
    const response = await fetch(`${URL_API}/${BlogCategory.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Formdata)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createBlogCategory(BlogCategory: BlogCategories): Promise<BlogCategories> {

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(BlogCategory)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function configBlogCategoriesProductRelevantNews(BlogCategoriesIds: string[]): Promise<{ message: string }> {
    const response = await fetch(`${URL_API}/configBlogCategoriesProductRelevantNews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ BlogCategoriesIds })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getBlogCategoriesFiltered(filterOptions: filterOptions): Promise<{ data: BlogCategories[]; totalRows: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.parent_id) params.append("ByIdParent", filterOptions.parent_id);
    if(filterOptions.filterlike) params.append("filterLike", filterOptions.filterlike);
    if(filterOptions.typeBlogCategories) params.append("typeBlogCategories", filterOptions.typeBlogCategories);
    if(filterOptions.orderBy){
        switch (filterOptions.orderBy) {
            case "ByASC":
            case "ByDESC":
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
