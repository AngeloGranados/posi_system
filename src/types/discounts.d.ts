export type tableThNameDiscounts = "id" | "product_id" | "discount_type" | "valid_from" | "is_active" | "actions";
export type orderByAscDescDiscounts = Exclude<tableThNameDiscounts, "actions">;
export type orderByDiscounts = "ByASC" | "ByDESC";
export interface tableThDiscounts {
    name: tableThNameDiscounts;
    value: string;
    className?: string;
}

export interface Discounts {
    id?: number,
    product_id: number,
    discount_type: "percentage" | "fixed",
    discount_value: number,
    valid_from: Date,
    valid_until: Date,
    is_active?: boolean,
}

