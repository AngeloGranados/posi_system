import { orderByAscDescShippingMethods, orderByShippingMethods, ShippingMethods } from "@/types/shippingMethods";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}shipping_methods`;

interface filterOptions {
    orderField: orderByAscDescShippingMethods;
    orderBy: orderByShippingMethods;
    limit: number;
    page: number;
}

export async function getShippingMethods(): Promise<ShippingMethods[]> {
    const response = await fetch(`${URL_API}`);
    if (!response.ok) {
        throw new Error("Error fetching shippingMethodss");
    }
    return response.json();
}

export async function deleteShippingMethods(shippingMethodsId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${shippingMethodsId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateShippingMethods(shippingMethods: ShippingMethods): Promise<ShippingMethods> {

    const response = await fetch(`${URL_API}/${shippingMethods.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shippingMethods)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createShippingMethods(shippingMethods: ShippingMethods): Promise<ShippingMethods> {

     const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shippingMethods)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getShippingMethodsFiltered(filterOptions: filterOptions): Promise<{ data: ShippingMethods[]; totalRows: number}>{

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
