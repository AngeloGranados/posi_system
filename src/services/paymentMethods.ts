import { filterOptions, orderByAscDescPaymentMethods, orderByPaymentMethods, PaymentMethods } from "@/types/paymentMethods";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}payment_methods`;

export async function getPaymentMethods(): Promise<PaymentMethods[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deletePaymentMethods(paymentMethodsId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${paymentMethodsId}`, {
        method: "DELETE",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
}

export async function updatePaymentMethods(paymentMethods: PaymentMethods): Promise<PaymentMethods> {

    const formData = new FormData();
    formData.append("name", paymentMethods.name);
    formData.append("code", paymentMethods.code);
    formData.append("description", paymentMethods.description);
    formData.append("account_number", paymentMethods.account_number);
    formData.append("account_name", paymentMethods.account_name);
    formData.append("image_url", paymentMethods.image_url);

    const response = await fetch(`${URL_API}/${paymentMethods.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createPaymentMethods(paymentMethods: PaymentMethods): Promise<PaymentMethods> {
    const formData = new FormData();
    formData.append("name", paymentMethods.name);
    formData.append("code", paymentMethods.code);
    formData.append("description", paymentMethods.description);
    formData.append("account_number", paymentMethods.account_number);
    formData.append("account_name", paymentMethods.account_name);
    formData.append("image_url", paymentMethods.image_url);

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getPaymentMethodsFiltered(filterOptions: filterOptions): Promise<{ data: PaymentMethods[]; totalRows: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.byStatus) params.append("byStatus", filterOptions.byStatus);
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

export async function changeStatusPaymentMethod(id: string, newStatus: boolean): Promise<{ success: boolean }> {
    const response = await fetch(`${URL_API}/changeStatus/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ newStatus })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || "Error changing payment method status");
    }
    return data;
}