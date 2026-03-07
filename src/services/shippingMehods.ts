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

export async function deleteShippingMethods(shippingMethodsId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${shippingMethodsId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting shippingMethods");
    }
}

export async function updateShippingMethods(shippingMethods: ShippingMethods): Promise<ShippingMethods> {

    const response = await fetch(`${URL_API}/${shippingMethods.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shippingMethods)
    });

    if (!response.ok) {
        throw new Error("Error updating shippingMethods");
    }

    return response.json();
}

export async function createShippingMethods(shippingMethods: ShippingMethods): Promise<ShippingMethods> {

     const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shippingMethods)
    });

    if (!response.ok) {
        throw new Error("Error creating shippingMethods");
    }

    return response.json();
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
    if (!response.ok) {
        throw new Error("Error fetching filtered shippingMethods");
    }
    return response.json();
}
