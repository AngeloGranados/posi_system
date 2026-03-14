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
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteBrands(brandId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${brandId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateBrands(brand: Brands): Promise<Brands> {

    const response = await fetch(`${URL_API}/${brand.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brand)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createBrands(brand: Brands): Promise<Brands> {

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brand)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
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
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
