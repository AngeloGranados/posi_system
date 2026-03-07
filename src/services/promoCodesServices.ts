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
    if (!response.ok) {
        throw new Error("Error fetching promoCodes");
    }
    return response.json();
}

export async function deletePromoCodes(promoCodesId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${promoCodesId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting promoCodes");
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

    if (!response.ok) {
        throw new Error("Error updating promoCodes");
    }

    return response.json();
}

export async function createPromoCodes(promoCodes: PromoCodes): Promise<PromoCodes> {
 
    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promoCodes)
    });

    if (!response.ok) {
        throw new Error("Error creating promoCodes");
    }

    return response.json();
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
    if (!response.ok) {
        throw new Error("Error fetching filtered promoCodes");
    }
    return response.json();
}
