export function formatPrice(price: number | string): string {
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    return new Intl.NumberFormat('es-PE', { style : 'currency', currency: 'PEN' }).format(price);
}

export function formatTelephone(phone: string): string {
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
export function verifyColorByStatus(status: string): BadgeColor {
    return (
        status === 'pending' ? 'warning' : 
        status === "delivered" ? 'success' : 
        status === "cancelled" ? 'error' : 
        status === "processing" ? 'info' : 
        status === "shipped" ? 'success' : 
        'light'
    )
}