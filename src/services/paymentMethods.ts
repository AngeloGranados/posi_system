import { orderByAscDescPaymentMethods, orderByPaymentMethods, PaymentMethods } from "@/types/paymentMethods";


const URL_API = `${process.env.NEXT_PUBLIC_API_URL}payment_methods`;

interface filterOptions {
    orderField: orderByAscDescPaymentMethods;
    orderBy: orderByPaymentMethods;
    limit: number;
    page: number;
}

export async function getPaymentMethods(): Promise<PaymentMethods[]> {
    const response = await fetch(`${URL_API}`);
    if (!response.ok) {
        throw new Error("Error fetching paymentMethods");
    }
    return response.json();
}

export async function deletePaymentMethods(paymentMethodsId: number): Promise<void> {
    const response = await fetch(`${URL_API}/${paymentMethodsId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting paymentMethods");
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
        body: formData
    });

    if (!response.ok) {
        throw new Error("Error updating paymentMethods");
    }

    return response.json();
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
        body: formData
    });

    if (!response.ok) {
        throw new Error("Error creating paymentMethods");
    }

    return response.json();
}

export async function getPaymentMethodsFiltered(filterOptions: filterOptions): Promise<{ data: PaymentMethods[]; totalRows: number}>{

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
        throw new Error("Error fetching filtered paymentMethods");
    }
    return response.json();
}
