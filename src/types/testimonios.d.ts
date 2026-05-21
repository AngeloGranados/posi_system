
export type tableThNameTestimonios = "id" | "name" | "rating" | "type" | "comment" | "status" | "created_at" | "updated_at" | "actions";
export type orderByAscDescTestimonios = Exclude<tableThNameTestimonios, "actions">;
export type orderByTestimonios = "ByASC" | "ByDESC";
export type statusTestimonios = "pending" | "approved" | "rejected";
export interface tableThTestimonios {
    name: tableThNameTestimonios;
    value: string;
    className?: string;
}
export interface filterOptions {
    orderField: orderByAscDescTestimonios;
    orderBy: orderByTestimonios;
    byStatus: statusTestimonios;
    limit: number;
    page: number;
}
export interface Testimonios {
    id?: string,
    product_id: string,
    user_id?: string,
    name: string,
    rating: number,
    type: "website" | "product",
    comment: string,
    status: statusTestimonios,
    created_at?: Date | string,
    updated_at?: Date | string
}


