import { Attributes, orderByAscDescAttributes, orderByAttributes } from "@/types/attributes";



const URL_API = `${process.env.NEXT_PUBLIC_API_URL}attributes`;

interface filterOptions {
    orderField: orderByAscDescAttributes;
    orderBy: orderByAttributes;
    limit: number;
    page: number;
}

export async function getAttributes(): Promise<Attributes[]> {
    const response = await fetch(`${URL_API}`);
    if (!response.ok) {
        throw new Error("Error fetching attributes");
    }
    return response.json();
}

export async function deleteAttributes(attributesId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${attributesId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateAttributes(attributes: Attributes): Promise<Attributes> {

    const response = await fetch(`${URL_API}/${attributes.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(attributes)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createAttributes(attributes: Attributes): Promise<Attributes> {

     const response = await fetch(`${URL_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(attributes)
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getAttributesFiltered(filterOptions: filterOptions): Promise<{ data: Attributes[]; totalRows: number}>{

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
