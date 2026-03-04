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
    if (!response.ok) {
        throw new Error("Error fetching discounts");
    }
    return response.json();
}

export async function deleteDiscounts(discountsId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${discountsId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting discounts");
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

    if (!response.ok) {
        throw new Error("Error updating discounts");
    }

    return response.json();
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

    if (!response.ok) {
        throw new Error("Error creating discounts");
    }

    return response.json();
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
    if (!response.ok) {
        throw new Error("Error fetching filtered discounts");
    }
    return response.json();
}
