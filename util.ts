import { statusOrders } from "@/types/orders";

export function formatPrice(price: number | string): string {
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    return new Intl.NumberFormat('es-PE', { style : 'currency', currency: 'PEN' }).format(price);
}

export function formatTelephone(phone: string): string {
    if (!phone) return "";
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 9) {
        return `+51 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
    }
    return phone;
}

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";
export function verifyColorByStatus(status: statusOrders): BadgeColor {
    return (
        status === 'pending' ? 'warning' : 
        status === "delivered" ? 'success' : 
        status === "cancelled" ? 'error' : 
        status === "processing" ? 'info' : 
        status === "shipped" ? 'success' : 
        'light'
    )
}

export function formatDate(dateString: string): string {
    const data = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return data.toLocaleDateString('es-PE', options);
}

export function getNowDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}