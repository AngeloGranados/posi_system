import { Categories, filterOptions, orderByAscDescCategories, orderByCategories } from "@/types/categories";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}category`;



export async function getCategories(): Promise<Categories[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${categoryId}`, {
        method: "DELETE",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function changeStatusCategory(id: string, newStatus: boolean): Promise<{ success: boolean }> {
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
        throw new Error(data.error || "Error changing category status");
    }
    return data;
}

export async function updateCategory(category: Categories): Promise<Categories> {

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("description", category.description);
    formData.append("description_seo", category.description_seo);
    formData.append("image_url", category.image_url);
    formData.append("parent_id", category.parent_id ? category.parent_id.toString() : "");

    const response = await fetch(`${URL_API}/${category.id}`, {
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

export async function createCategory(category: Categories): Promise<Categories> {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("description", category.description);
    formData.append("description_seo", category.description_seo);
    formData.append("parent_id", category.parent_id ? category.parent_id.toString() : "");
    formData.append("image_url", category.image_url);

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

export async function configCategoriesProductRelevantNews(categoriesIds: string[]): Promise<{ message: string }> {
    const response = await fetch(`${URL_API}/configCategoriesProductRelevantNews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ categoriesIds })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getCategoriesFiltered(filterOptions: filterOptions): Promise<{ data: Categories[]; totalRows: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.parent_id) params.append("ByIdParent", filterOptions.parent_id);
    if(filterOptions.filterlike) params.append("filterLike", filterOptions.filterlike);
    if(filterOptions.typeCategories) params.append("typeCategories", filterOptions.typeCategories);
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
