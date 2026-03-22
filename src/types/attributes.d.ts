export type tableThNameAttributes = "id" | "category_id" | "attribute_name" | "attribute_unit" | "actions";
export type orderByAscDescAttributes = Exclude<tableThNameAttributes, "actions">;
export type orderByAttributes = "ByASC" | "ByDESC";
export interface tableThAttributes {
    name: tableThNameAttributes;
    value: string;
    className?: string;
}

export interface Attributes {
    id?: string,
    category_id: string,
    category_name?: string,
    attribute_name: string,
    attribute_unit: string
}

export interface AttributesProduct {
    id?: string,
    product_id?: string,
    category_attribute_id?: string,
    attribute_value?: string,
}

