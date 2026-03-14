export type tableThNamePromoCodes = "id" | "code" | "description" | "discount_type" | "min_purchase" | "max_discount" | "usage_limit" | "used_count" | "valid_from"  | "is_active" | "actions";
export type orderByAscDescPromoCodes = Exclude<tableThNamePromoCodes, "actions">;
export type orderByPromoCodes = "ByASC" | "ByDESC";
export interface tableThPromoCodes {
    name: tableThNamePromoCodes;
    value: string;
    className?: string;
}

export interface PromoCodes {
    id?: string,
    code: string,
    description: string,
    discount_type: "percentage" | "fixed",
    discount_value: number,
    min_purchase: number,
    max_discount: number,
    usage_limit: number,
    used_count?: number,
    valid_from: Date,
    valid_until: Date,
    is_active?: boolean,
}

