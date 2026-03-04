import { Brands, orderByAscDescBrands, orderByBrands } from "@/types/brands";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}brands`;

interface filterOptions {
    orderField: orderByAscDescBrands;
    orderBy: orderByBrands;
    limit: number;
    page: number;
}

export async function getBrands(): Promise<Brands[]> {
    const response = await fetch(`${URL_API}`);
    if (!response.ok) {
        throw new Error("Error fetching brands");
    }
    return response.json();
}

export async function deleteBrands(brandId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${brandId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting brand");
    }
}

export async function updateBrands(brand: Brands): Promise<Brands> {

    const response = await fetch(`${URL_API}/${brand.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brand)
    });

    if (!response.ok) {
        throw new Error("Error updating brand");
    }

    return response.json();
}

export async function createBrands(brand: Brands): Promise<Brands> {

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brand)
    });

    if (!response.ok) {
        throw new Error("Error creating brand");
    }

    return response.json();
}

export async function getBrandsFiltered(filterOptions: filterOptions): Promise<{ data: Brands[]; totalRows: number}>{

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
        throw new Error("Error fetching filtered brands");
    }
    return response.json();
}
