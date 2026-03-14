import { orderByAscDescDiscounts, orderByDiscounts, Discounts } from "@/types/discounts";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}discounts`;

interface filterOptions {
    orderField: orderByAscDescDiscounts;
    orderBy: orderByDiscounts;
    limit: number;
    page: number;
}

export async function getDiscounts(): Promise<Discounts[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteDiscounts(discountsId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${discountsId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function updateDiscounts(discounts: Discounts): Promise<Discounts> {

    console.log("Updating discounts:", discounts); // Agrega este log para verificar los datos que se están enviando

    const response = await fetch(`${URL_API}/${discounts.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(discounts)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createDiscounts(discounts: Discounts): Promise<Discounts> {

    console.log("Creating discounts:", discounts); // Agrega este log para verificar los datos que se están enviando
    
    
    const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(discounts)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getDiscountsFiltered(filterOptions: filterOptions): Promise<{ data: Discounts[]; totalRows: number}>{

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
