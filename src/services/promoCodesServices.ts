import { orderByAscDescPromoCodes, orderByPromoCodes, PromoCodes } from "@/types/promoCodes";



const URL_API = `${process.env.NEXT_PUBLIC_API_URL}promo_codes`;

interface filterOptions {
    orderField: orderByAscDescPromoCodes;
    orderBy: orderByPromoCodes;
    limit: number;
    page: number;
}

export async function getPromoCodes(): Promise<PromoCodes[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deletePromoCodes(promoCodesId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${promoCodesId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function updatePromoCodes(promoCodes: PromoCodes): Promise<PromoCodes> {

    const response = await fetch(`${URL_API}/${promoCodes.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promoCodes)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createPromoCodes(promoCodes: PromoCodes): Promise<PromoCodes> {
 
    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promoCodes)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getPromoCodesFiltered(filterOptions: filterOptions): Promise<{ data: PromoCodes[]; totalRows: number}>{

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
