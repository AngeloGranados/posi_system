import { orderByAscDescOrders, orderByOrders, OrderItems, Orders } from "@/types/orders";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}orders`;

interface filterOptions {
    orderField: orderByAscDescOrders;
    orderBy: orderByOrders;
    limit: number;
    page: number;
}

export async function getOrdersFiltered(filterOptions: filterOptions): Promise<{ data: Orders[]; totalRows: number}>{

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

export async function getOrderById(orderNumber: string): Promise<Orders | null> {
    const response = await fetch(`${URL_API}/${orderNumber}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getOrderItemsByOrderId(orderNumber: string): Promise<OrderItems[]> {
    const response = await fetch(`${URL_API}/getOrderItemsByOrderId/${orderNumber}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
