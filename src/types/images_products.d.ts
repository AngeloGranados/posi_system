export type tableThNameImagesProducts = "id" | "product_id" | "image_url" | "alt_text" | "sort_order" | "attribute_value" | "actions";
export type orderByAscDescImagesProducts = Exclude<tableThNameImagesProducts, "actions">;
export type orderByImagesProducts = "ByASC" | "ByDESC";
export interface tableThImagesProducts {
    name: tableThNameImagesProducts;
    value: string;
    className?: string;
}

export interface ImagesProducts {
    id?: string;
    product_id: string;
    image_url: File;
    alt_text: string;
    sort_order: number;
    attribute_value: string;
    product_name?: string;
    product_slug?: string;
}

