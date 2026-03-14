export type tableThNameOrders = 
| "id"
| "order_number"
| "email"
| "subtotal"
| "shipping_cost"
| "discount"
| "total"
| "status"
| "is_paid"
| "created_at"
| "actions";

export type orderByAscDescOrders = Exclude<tableThNameOrders, "actions">;
export type orderByOrders = "ByASC" | "ByDESC";
export interface tableThOrders {
    name: tableThNameOrders;
    value: string;
    className?: string;
}

export interface Orders {
    id?: string,
    order_number: string,
    user_id: string | null,
    session_id: string,
    email: string,
    subtotal: number | string, 
    shipping_cost: number | string,
    discount: number | string,
    total: number | string,
    shipping_method_id: string,
    payment_method_id: string,
    shipping_address_id: string,
    billing_address_id: string,
    promo_code_id: number | null,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    is_paid: boolean | number, 
    paid_at: Date | string | null,
    notes?: string | null,
    created_at?: Date | string,
    updated_at?: Date | string,
    order_user_id?: string | null,
    payment_method_name?: string,
    payment_method_image?: string,
    shipping_method_name?: string,
    shipping_address?: string,
    shipping_phone?: string,
    shipping_address_name?: string,
}

export interface OrderItems {
    id?: string,
    cart_id: number,
    product_id: string,
    quantity: number,
    price_at_added: number,
    selected_attributes: { key: string; value: string }[] | null,
    created_at?: Date | string,
    updated_at?: Date | string,
    image_url?: string | null,
    order_id?: string,
    price?: number | string,
    product_name?: string,
    subtotal?: number | string
}

