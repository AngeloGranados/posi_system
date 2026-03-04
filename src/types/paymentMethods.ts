export type tableThNamePaymentMethods = "id" | "name" | "account_name" | "description" | "is_active" | "actions";
export type orderByAscDescPaymentMethods = Exclude<tableThNamePaymentMethods, "actions">;
export type orderByPaymentMethods = "ByASC" | "ByDESC";
export interface tableThPaymentMethods {
    name: tableThNamePaymentMethods;
    value: string;
    className?: string;
}

export interface PaymentMethods {
    id?: number;
    code: string;
    name: string;
    description: string;
    account_number: string;
    account_name: string;
    image_url: File;
    is_active?: boolean;
}

