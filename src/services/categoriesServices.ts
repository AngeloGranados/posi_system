import { Categories, orderByAscDescCategories, orderByCategories } from "@/types/categories";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}category`;

interface filterOptions {
    orderField: orderByAscDescCategories;
    orderBy: orderByCategories;
    limit: number;
    page: number;
}

export async function getCategories(): Promise<Categories[]> {
    const response = await fetch(`${URL_API}`);
    if (!response.ok) {
        throw new Error("Error fetching categories");
    }
    return response.json();
}

export async function deleteCategory(categoryId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${categoryId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting category");
    }
}

export async function updateCategory(category: Categories): Promise<Categories> {

    console.log("Updating category:", category); // Agrega este log para verificar los datos
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("description", category.description);
    formData.append("image_url", category.image_url);

    const response = await fetch(`${URL_API}/${category.id}`, {
        method: "PUT",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Error updating category");
    }

    return response.json();
}

export async function createCategory(category: Categories): Promise<Categories> {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("description", category.description);
    formData.append("image_url", category.image_url);

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Error creating category");
    }

    return response.json();
}

export async function getCategoriesFiltered(filterOptions: filterOptions): Promise<Categories[]>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
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
    if (!response.ok) {
        throw new Error("Error fetching filtered categories");
    }
    return response.json();
}
