export type tableThNameShippingMethods = "id" | "name" | "description" | "price" | "estimated_days_min" | "is_active" |"actions";
export type orderByAscDescShippingMethods = Exclude<tableThNameShippingMethods, "actions">;
export type orderByShippingMethods = "ByASC" | "ByDESC";
export interface tableThShippingMethods {
    name: tableThNameShippingMethods;
    value: string;
    className?: string;
}
export interface filterOptions {
    orderField: orderByAscDescShippingMethods;
    orderBy: orderByShippingMethods;
    byStatus: 'active' | 'inactive';
    limit: number;
    page: number;
}
export interface ShippingMethods {
    id?: string,
    code: string,
    name: string,
    description: string,
    price: number,
    estimated_days_min: number,
    estimated_days_max: number,
    is_active?: boolean,
}

